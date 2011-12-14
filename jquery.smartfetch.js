//store json hashes in an array - each element will have a JSON object, and a timestamp, and a URL. 
var smartFetch = [];

(function($){
   var methods = {
   
      init: function(options){

         var defaults = {
           url: false, 
		   success: function(data) {
		       alert('success');
		   },
		   error: function(data) {
		       alert(strMessage);
		   }
         }     
     
	     var opts = $.extend(defaults, options);
         var now = Date.now();
		 //If not found, the index will be the next element
		 //In js, arrays are never out of bounds.
		 var smartFetchIndex = smartFetch.length;
		 var boolRefresh = true;
		 
		 if(!opts.url) {
		    opts.error("You need to pass in a URL for this to work.");
			return;
		 }

         for(var i=0; i < smartFetch.length; i++) {
		 //type enforced comparison
		   if( smartFetch[i].url === opts.url){
		      smartFetchIndex = i;
			  if(smartFetch[i].timestamp > now) {
			    boolRefresh = false;
				//found the right one, I found the right one.
				opts.success(smartFetch[i].JSON);
			  }
		   }
		 }
		 if(booolRefresh) {
		     // Call the service because the cache either doesn't exist or has expired.
			// I didn't find it in my array or timestamp has already expired. 
			//find if you stored your url. Find the actual index it exists.
			 //JS is weakly typed.
		$.ajax({
          url: opts.url,
          datatype: "json",
          type: "GET",
          success: function(data){
             smartFetch[smartFetchIndex].JSON = data;//store data
			 smartFetch[smartFetchIndex].url = opts.url;//store url
			 // keep stuff in cache for 5 minutes.
             var expiresTime = now.SetSeconds(now.getSeconds + 300);
             smartFetch[smartFetchIndex].timestamp = expiresTime;
             opts.sucesss(data);			 
         },
         error: function(data) {
             opts.error(data);
         }		 

       });		
		 }
      }
};	  

   $.fn.smartFetch = function(method) {
		// Method calling logic
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
	    } else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
	    } else {
			$.error( 'Method ' +  method + ' does not exist' );
	    } 
	}
})(jQuery);