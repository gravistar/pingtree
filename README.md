For now, this is just misc notes.

In bash, use $(VAR_NAME) to invoke a command stored in a var

Remember to export NODE_PATH=/usr/local/lib/node_modules

Mocha needs special care to do async stuff.
    My guess is that it doesn't actually call any callbacks, unless you
        are explicit about it.

Seems like changes won't even show up until the datastore is done sync-ing,
    I wrote a dummy poll method that uses setTimeout to check for this. 
        Might be a valuable util.

Funky shit is still happening with close. Keep an eye on this:
   http://stackoverflow.com/questions/18104535/closing-out-dropbox-datastore-api-in-nodejs 
