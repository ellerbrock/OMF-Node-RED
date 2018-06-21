This is a walkthru in understanding an OMF application in Node-RED to send to PI3.  This walkthru will also generally apply to Osisoft Cloud Services (OCS) and Edge Data Store (EDS), but there are some differences in what to expect.  The areas where there is a difference for EDS and OCS will be pointed out with a *, but not dove into.  If you want a walkthru focused on OCS and EDS, please request one.  This walkthru also focused just on PI Points, if you would like to see one highlighting AF, please request it.

Prerequisites
Node-RED installed (https://nodered.org/)
OSI-OMF Node-RED nodes  (https://github.com/osisoft/OMF-Node-RED)
wundeground node 
wunderground API (free -- https://www.wunderground.com/weather/api/) 
basic understanding of Node-RED

In this walkthru we start with a created flow.

1)	Import JSON of weather flow (https://github.com/osisoft/OMF-Node-RED/tree/master/Flows/weather_walkthru.json)

2)  Add wUnderground api key to node (Yellowish node, 2nd from start, labeled Loveland)
	-Change to the city you want to.

3)	Update the urlConfiguration URL  to the URL of the Connector Relay as copied from the PI Data Collection Manager*.
	--Note the urlConfiguration is sharable among the various OMF nodes.  In this example all 3 are using the same urlConfiguration so updating 1 will update them all
	-Click into the node labled osisoft-omf-type.  Click the pencil next to the URL Configuration.  Update the URL field (you can update the Name too if you want it to be clear what the URL is pointing to - like TestPI or ProductionPI)
	
4) Update the producer token to the producer token of the Connector Relay as copied from the PI Data Collection Manager*.
	--Note the header configuration is sharable among the various OMF nodes.  In this example all 3 are using the same header configuration so updating 1 will update them all
	-Click into the node labled osisoft-omf-type.  Click the pencil next to the Header Configuration.  Update the producer token field (you can update the Name too if you want it to be clear what the header is used for- like TestPI or ProductionPI)
	
5)  This flow has lots of debugging put in.  It is now your flow, so get rid of it , keep, or rename as you deem appropriate.  The debugging will help you understand what you are sending and verify that it was accepted.  	

6) At this point you could possibly send what you have. 
	-- Note the http request sending nodes cansend to endpoints where the certificates have not been verified by default.  This is done because the PI Connector Relay by default ships with a self signed cert.  So you either need to add that cert to your node-red machine's cert store (and possibly update your hosts file to handle the Connector Relay's IP address lookup to domain name) or replace the certficatie with one that is verified.  If you remove this option and you have not handled the certificate properly you will get errors.  To enforce the certificate verification uncheck "Enable secure SSL/TLS connection".
	
7) Type Configuartion * 
	--Note the type configuration is shared with the osisoft-omf-type node, osisoft-omf-container node, and osisoft-omf-data node.  It can be updated, or created anywhere and referenced multiple times.
	-- Think of this as your object definition.  When you create this you are telling the system what to expect that you will be sending.
	- Type ID -- required
		- Not seen by end user
	- Classification -- required
		- Dynamic means PI Tags (use this)
		- Static means AF structure
	- Version -- not required
		- Allows you to change the Type definition  -- read documentation closely before doing this
	- Friendly Name -- not required
		- For Dynamic does nothing
	- Description 
		- For Dynamic does nothing
	- Tags
		-For Dynamic does nothing
	- Metadata
		-For Dynamic does nothing
	- Add _time
		- adds a property that is there for recording the time.  Note with PI3 and dynamic every property that is not the time index will become its own PI Tag.  
		- for PI3 this is a great default option 
	- Properties
		--In the example you already have tempk, tempc, tempf, humidity, windspeed, winddirection defined for you.  What this means is when you start sending data to this type you will get 6 PI Tags with values.  Each tag will get the value sent at the timestamp sent to _time.  Without knowing how the PI Data Collection Manager is set up I suggest seraching on *{{property name}}* -- *tempf*.  To find the tag that gets created
		- Enter the number of properties you want (not including your time index)
		- Click the Set Number of Properties button
		- Name the properties.  The name will become part of the PI Tag name.  Choose the type the property is, as this determines how it will be stored and analyzed in PI.

8) Container Configuration *
	--Note the type configuration is shared with the osisoft-omf-container node and osisoft-omf-data node.  It can be updated, or created anywhere and referenced multiple times.
	-- Think of this as your object instantition.  When you create this you are telling the system an ID of the object type you will be sending.  
	- Container ID -- required
		- Typically part of the PI3 tag name.  
		- Must be unique to end system,
		-- In the example we use mustaching.  Please read readme.md to see how it works.
	- type id -- required (if type is not selected)
		- Used to tie container ID to type
	- type Version -- not required
		- Used to tie container ID to a type version -- again see documentation when dealing with versions of OMF object
	- Friendly Name -- not required
		- Becomes part of the PI3 tag name instead of the containerID (to help with uniqness requirements of ID)
	- Description -- not required
		- Becomes the pi tag's description
	- Tags
		-For Dynamic does nothing
	- Metadata
		-For Dynamic does nothing
		
8) Data Configuration * 
	- Container ID --  required (if container is not selected).
		--Note not required, can use the TypeID and other informatoin to do the routing, but not recommended
		-Needed to know where to route the information insdie the PI System
	- type id -- not used (if containerID is used)
		- Used to route data to proper spot
	- type Version -- not used (if containerID is used)
		- Used to tie type ID to a type version -- again see documentation when dealing with versions of OMF object
	- Value Array -- not required
		- If you already have made you data into an OMF valid array then you can either enter the string here or point to the json string representation of this. -- not a common way of doing this
	- Properties
	- Set Number of Properties -- not a common way of doing this
	- Load Properties from Type -- recommended way!
		-- Assuming you have your type selected for your container above then you can just load your property information from that type.  
	- Properties Column 1 
		-Property Name -- if loaded don't modify this...
		
	- Properties Column 2
		-Property Data 
		-In our example we are getting 1 data point at a time (1 data point for multiple data points).  So using mustaching navigate to the right part of the payload and bring in that value.  
		--Note if your data source brings in multiple values to send at the same time this can be handled on this node by utilizing the ~~ parameter inside the mustaching- see the info pane for details.  
		--Note if you data source requires something more complicated or difficult than the the ~~ and mustaching allow please ask or write a custom function to either be an intermediate or to make a valid OMF data values array.  
	- Metadata
		-For Dynamic does nothing
 
		
		
		


