/**
 * Created by Paul on 4/14/2015.
 */

("blur focus focusin focusout load resize scroll unload click dblclick " +
"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
"change select submit keydown keypress keyup error contextmenu").split(" ").forEach(
  function( name ) {

    // Handle event binding
    jBone.fn[ name ] = function( data, fn ) {
      return arguments.length > 0 ?
        this.on( name, null, data, fn ) :
        this.trigger( name );
    };
  });

jBone.event.special= {};