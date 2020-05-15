const jwt = require('jsonwebtoken')
const JWT_SECRET = "SECRET___SGS"
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const { UserInputError, AuthenticationError, PubSub } = require('apollo-server');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const pubsub = new PubSub()


ObjectId.prototype.valueOf = function () {
    return this.toString();
};
module.exports = {
    Query: {
        me: (root, args, context) => {
            return context.currentUser
        },
        allGenres: () => Book.collection.distinct("genres"
        ),
        bookCount: () => Book.collection.countDocuments(),
        authorCount: () => Author.collection.countDocuments(),
        allBooks: async (root, args) => {

            let books
            if (!args.author && !args.genre) {
                books = await Book.find({}).populate("author");
            } else if (args.author && args.genre) {
                books = await Book.find({ genres: { $in: [args.genre] } }).populate({ path: "author", match: { name: args.author } });

            } else if (!args.author && args.genre) {
                books = await Book.find({ genres: { $in: [args.genre] } }).populate("author");

            } else {
                books = await Book.find({}).populate({ path: "author", match: { name: args.author } });
            }
            books = books.filter(book => book.author && book.author.name)

            return books
        },
        allAuthors: async () => {
            const authors = await Author.find({}).populate('books')

            const newAuthors = authors.map(author => {
                return {
                    id: author._id,
                    born: author.born,
                    books: author.books,
                    name: author.name,
                    bookCount: author.books.length ? author.books.length : 0
                }
            })
            return newAuthors
        },
    },
    Mutation: {
        createUser: async (root, args) => {
            const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
            try { await user.save() }
            catch (err) {
                throw new UserInputError(err.message, { invalidArgs: args })
            }
            return user
        },
        login: async (root, args) => {
            const user = await User.findOne({ usename: args.usename })
            if (!user || args.password !== 'secred') {
                throw new UserInputError('wrong credentials')
            }
            const userFromToken = {
                username: user.usename,
                id: user._id
            }
            return { value: jwt.sign(userFromToken, JWT_SECRET) }
        },
        addBook: async (root, args, context) => {
            const currentUser = context.currentUser

            if (!currentUser) {
                throw new AuthenticationError('not authenticated')
            }
            const book = new Book({ ...args });
            const author = await Author.findOne({ name: args.author })

            if (author) {
                author.books = author.books.concat(book)
                book.author = author
                try { await author.save() } catch (error) {
                    throw new UserInputError(error.message, {
                        invalidArgs: args
                    })
                }
            }

            console.log(author);
            let newAuthor
            if (!author) {
                newAuthor = new Author({ name: args.author, books: [book] })
                try {
                    newAuthor = await newAuthor.save()
                    book.author = newAuthor
                } catch (error) {
                    throw new UserInputError(error.message, {
                        invalidArgs: args
                    })
                }
            }

            try { await book.save() } catch (error) {
                throw new UserInputError(error.message, {
                    invalidArgs: args
                })
            }
            pubsub.publish('BOOK_ADDED', { bookAdded: book })
            return book
        },
        addAuthor: async (root, args, context) => {
            const currentUser = context.currentUser

            if (!currentUser) {
                throw new AuthenticationError('not authenticated')
            }
            const author = new Author({ ...args });
            try { await author.save() } catch (error) {
                throw new UserInputError(error.message, {
                    invalidArgs: args
                })
            }
            return author
        },
        editAuthor: async (root, args, context) => {
            const currentUser = context.currentUser

            if (!currentUser) {
                throw new AuthenticationError('not authenticated')
            }
            const author = await Author.findOne({ name: args.name })
            if (!author) return null
            author.born = args.setBornTo
            try { await author.save() } catch (error) {
                throw new UserInputError(error.message, {
                    invalidArgs: args
                })
            }

            return author
        },
    },
    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterator(["BOOK_ADDED"])
        }
    }
};
