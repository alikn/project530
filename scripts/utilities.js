define([],function(){
	"use strict";


    //returns all the keys of a received object
    function returnKeysOfObject(obj){
        var keys = [];
        for (var k in obj) {
            if (hasItem(obj, k)) {
                keys.push(k);
            }
        }
        return keys;
    }

    //receives an object and a key and returns a boolean value showing if the object has such a key
    function hasItem(obj, key){
        return obj.hasOwnProperty(key);
    }

    function removeElementFromArray(array, element){
    	return array.splice(array.indexOf(element), 1);
    }

	return {
		returnKeysOfObject 		: 		returnKeysOfObject,
		hasItem					: 		hasItem,
		removeElementFromArray 	: 		removeElementFromArray

	}
});