morton-page
===========
A data structure for maintaining a list of pages keyed by [Morton order](http://en.wikipedia.org/wiki/Z-order_curve) (also known as z-order or interleaving).

## Example

```javascript
//Create a 2D page store having a capacity of (1<<4) == 16
var pageStore = require("morton-page")(2, 4)

//Add a page
pageStore.add({key: [10, 10], value: "foo"})

//Retrieve a page
var x = pageStore.get(10, 10)
console.log(x)

//Remove the page
pageStore.remove(10, 10)

//Try pulling the page out (returns null now)
console.log(pageStore.get(10, 10))
```

## Install

    npm install morton-page

## API

```javascript
var createPageStore = require("morton-page")
```

### Constructor

#### `var store = createPageStore(dimension, log_size[, shift, key])`
Creates a z-order page store.

* `dimension` is the dimension of the pages
* `log_size` is the log base 2 of the number of buckets in the store
* `shift` is the number of bits to shift each page by before indexing (default: `0`)
* `key` is the property of each page to use for the index (default: `"key"`)

**Returns** An instance of a `MortonPageStore` class specialized for the given input parameters.

### Methods

#### `store.add(page)`
Adds a page to the store

* `page` is an object with a field called `key` which is an array of coordinates representing the identifier of the page in the store.

#### `store.get(i0, i1, ...)`
Retrieves the page with the given key from the page store

* `i0, i1, ...` is the name of the page

**Returns** The page with the key `i0, i1, ...` if it is in the store, or `null` otherwise.

#### `store.remove(i0, i1, ...)`
Removes the page with the given key from the store.

* `i0, i1, ...` is the key of the page

## FAQ

### Why use this instead of an object?

Basically it is faster and does not require creating any string objects.  All of the methods in this class require 0 allocations and thus will not trigger garbage collection events.

## Credits
(c) 2013 Mikola Lysenko. MIT License