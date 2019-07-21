Typeme!
=======

As I [recently build a lily58](https://twitter.com/kentaromiura/status/1152487251298754561), I wanted to train myself to be able to use this ergo keyboard as the layout is very different for muscle memory.

There are many online tools but they are either full of ads that I found distracts me too much or they makes you type meaningless things, which also don't work that well for me as I lose focus.

I decided to build a tool that slowly opens up, I currently am in phase one so I want to train to be able to use the base key, aka a-z, I might implement the rest at a later time.

This tool takes a list of words from words.json and starts from the 5 shorter one and provides you with random choice with the same subset of characters that are in those words, if you manage to successfully get less than 5% errors per round you open up more words (up to 5 more for 0 errors).
As the tool shows any random word within the subset available you might unluck all words way before finishing, that's expected.

As a bonus there's a little converter from a TEI (https://github.com/freedict/) format that I used to produce the italian words.json file.

In the app folder there is a node.js file which you can run with `node index`.
Yes, there's 0 dependency. You're welcome.
