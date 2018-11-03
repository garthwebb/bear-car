var segments,       // Number of segments to divide the sphere
	R,              // Radius of sphere in inches
	buffer = 1,     // Space in inches to leave at the left margin
	allowance = 0; // Seam allowance

function outputSlice() {
	var doc,
		widest,
		center,
		increment = (2*Math.PI)/100,
		prevX, prevY,
		arc,
		arcStart = Math.PI/2,
		arcEnd = 3*Math.PI/2,
		sliceLength,
		canvas,
		count,
		x, y;

	segments = $("#segments").attr('value');
	R = $("#radius").attr('value');

	sliceLength = ( 2 * R * Math.PI ) / 2
	allowance = 0.00490196078431373*(R-1)+.25; 

	// A circle is 2*PI radians, so the equator of a sphere is 1/4 of that or PI/2
	widest = segmentHalfDistance(0, segments);
	center = widest + buffer;

	canvas = [ center*2, sliceLength+(buffer*2) ];

	doc = new jsPDF('p', 'in', canvas);
	doc.setLineWidth(0.01);

	prevX = 0;
	prevY = 0;
	count = 0;

	var sizeLegend = "Length: " + sliceLength.toFixed(2) + '"\n' +
					"Widest: " + (2*widest+2*allowance).toFixed(2) + '"\n' +
					"Allowance: " + allowance.toFixed(2) + '"\n';

	doc.setFontSize(16);
	doc.text(1, 1, sizeLegend);

	var sideLength = 0;
	var dDelta = sliceLength * ( increment / ( Math.PI ) );
	var d = 0;

	for (arc=arcStart; arc<=arcEnd; arc+=increment) {
		x = segmentHalfDistance(arc, segments);
		var xDiff = x - prevX;		

		y = prevY + Math.sqrt( dDelta*dDelta - xDiff*xDiff );
		var yDiff = Math.abs( prevY - y );
//debugger;
		sideLength += Math.sqrt( xDiff*xDiff + yDiff*yDiff );
		
		console.log("D="+d+" / Y="+y+" / X="+x)

		doc.line(center + prevX, prevY + buffer, center + x, y + buffer);
		doc.line(center - prevX, prevY + buffer, center - x, y + buffer);
		

		
		if ( count % 2 == 0 ) {
			doc.line(center + prevX + allowance, prevY + buffer, center + x + allowance, y + buffer);
			doc.line(center - prevX - allowance, prevY + buffer, center - x - allowance, y + buffer);
		}
		count++;
		
		prevX = x;
		prevY = y;
		prevD = d;
	}

	console.log( "Side Length: " + sideLength );

	// Output as Data URI
	doc.output('datauri');
}

// This calculates half the distance between two longitude lines on
// a sphere with the latitude equal.  The argument 'p' is the
// latitude in radians.  Half the distance is returned so the two
// longitudinal lines can be drawn by mirroring this distance along a
// center line. 
function segmentHalfDistance(p, segments) {
	var segmentSpacing, d;
	
	segmentSpacing = (2 * Math.PI)/segments;

	haversine = cos2(p) * sin2(segmentSpacing/2);

	d = R * Math.atan2(Math.sqrt(haversine), Math.sqrt(1-haversine));

	return d;
}

function cos2(x) {
	return Math.cos(x) * Math.cos(x);
}

function sin2(x) {
	return Math.sin(x) * Math.sin(x);
}
