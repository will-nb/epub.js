import Book from '../src/book';
import {expect} from 'chai';

describe('Book', function() {

	describe('Unarchived', function() {
		var book = new Book("/fixtures/alice/OPS/package.opf");
		it('should open a epub', async function() {
			await book.opened
			expect(book.isOpen).to.be.true;
			expect(book.url.toString()).to.equal("http://localhost:9876/fixtures/alice/OPS/package.opf");
		});
		it('should have a local coverUrl', async function() {
			let coverUrl = await book.coverUrl();
			expect(coverUrl,"cover url is available:").equal("http://localhost:9876/fixtures/alice/OPS/images/cover_th.jpg");
			
		});
	});

	describe('Archived epub', function() {
		var book = new Book("/fixtures/alice.epub");

		it('should open a archived epub', async function() {
			await book.opened
			expect(book.isOpen, "book is opened").to.be.true;
			expect(book.archive, "book is unarchived").to.be.exist;
		});
		it('should have a blob coverUrl', async function() {
			let coverUrl = await book.coverUrl();
			expect(/^blob:http:\/\/localhost:9876\/[^\/]+$/.test(coverUrl),"cover url is available and a blob: url").to.be.true;
		});
	});

	describe('Archived epub in array buffer without options', function() {
		let book;

		before(async function() {
			const response = await fetch("/fixtures/alice.epub");
			const buffer = await response.arrayBuffer()
			book = new Book(buffer)
		})

		it('should open a archived epub', async function() {
			await book.opened
			expect(book.isOpen, "book is opened").to.be.true;
			expect(book.archive, "book is unarchived").to.be.exist;
		});

		it('should have a blob coverUrl', async function() {
			let coverUrl = await book.coverUrl();
			expect(coverUrl,"cover url is available and a blob: url").to.match(/^blob:http:\/\/localhost:9876\/[^\/]+$/);
		});
	});

	describe('Archived epub without cover', function() {
		var book = new Book("/fixtures/alice_without_cover.epub");

		it('should open a archived epub', async function() {
			await book.opened;
			expect(book.isOpen, "book is opened").to.be.true;
			expect(book.archive, "book is unarchived").to.be.exist;
		});
		it('should have a empty coverUrl', async function() {
			let coverUrl = await book.coverUrl();
			expect(coverUrl, "cover url should be null").to.be.null;
		});
	});
});
