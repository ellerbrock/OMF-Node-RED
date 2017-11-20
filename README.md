# OMF-Node-RED
This is a collection of nodes to use in [Node-RED](https://nodered.org/) to help generate an [OMF](http://omf-docs.readthedocs.io/en/latest/) message.  Node-RED is open-source, and is part of the [JS Foundation] (https://js.foundation/community/projects) and is a flow-based programming tool for IoT applications.     

## About
This project is a Node-RED add-in.  This project has separate nodes for the OMF Type, Container, and Data messages.  It has a shared configuration node for the URL and Header information needed to send messages.  All the fields are [mustachable](http://mustache.github.io/mustache.5.html) and the data fields in Data have an added mustache-ability to let you access properties in an object array.    

For example.  If you have a field with the value: {{payload.url}}.  And the node receives a message containing: 
{
  date: "Monday"
  payload: {
    url: "www.osisoft.com",
  }
}
The resulting field will be set to: "www.osisoft.com".

These nodes will not send the information but rather are to be connected to output nodes.
It is possible to use a property from the flow context or global context. Just use {{flow.name}} or {{global.name}}.


Note: By default, mustache will escape any HTML entities in the values it substitutes. To prevent this, use {{{triple}}} braces.

The added mustache-ability is only currently on OMF Data value fields.  This allows you to get loop over an array of objects and get values out of it.  You can specify the object's property with {\~[property]\~}. Such that a lookup of "{{{payload}}}{\~Temperature\~}" goes to the msg.payload array and loops over the various objects in the array and assigns the property Temperature to the specified property name. Note only 1 {\~[property]\~} allowed in a field.


## Tutorial
A sample flow is included in Flows.  This uses [wunderground](https://www.wunderground.com/) [nodes](https://www.npmjs.com/package/wundergroundnode) to generate the data.  The URLS to send OMF messages to are removed.  If you are connecting to [OCS](https://cloud.osisoft.com/welcome) you will need a producer token to connect.  To get access to OCS click [here](http://pages.osisoft.com/OSIsoft-Partner-Preview.html). 


## Pre-Reqs
Node-RED
An OMF accepting endpoint (Connector Relay, OCS, etc...).  You can also just route the messages to a debug node and view it in Node-RED.


## Contributing
We do welcome everyone to contribute and all contributions will be considered. Please make sure that you read our general [contribution guidelines](https://github.com/osisoft/contributing) and agree with it.  It also contains a lot if useful information. Please keep in mind that integrating your contribution may require some adjustments in your code, if this is the case this can be discussed in the Pull Request you submit.


## Licensing

Copyright 2017 OSIsoft, LLC.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

Please see the file named [LICENSE](LICENSE).

