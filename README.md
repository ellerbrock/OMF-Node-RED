# OMF-Node-RED
Nodes to use in Node-RED to help generate an OMF (http://omf-docs.readthedocs.io/en/latest/) message

## About
This project is a Node-RED add-in.  This project has seperate nodes for the OMF Type, Containerm and Data messages.  The nodes can be installed seperately or alltogether -- recommended.  It has a shared configuration node for the URL and Header infromation needed to send messages.  All the fields are mustachable and the data fields in Data have an added mustache-ability to let you access properties in an object array.

These nodes will not send the information but rather are to be connected to the normal http nodes.


## Tutorial
A sample flow is included in Flows.  This uses wunderground to generate the data.  The URLS are removed.  If you are connecting to OCS you will need a producer token to connect.  


## Pre-Reqs
Node-RED
An OMF accepting endpoint (Connector Relay, OCS) -- unless you just want to see the messages...


## Contributing
We do welcome everyone to contribute and be certain all contributions will be considered. Please make sure
that you read our general [contribution guidelines][1] and agree with it; it also contains a lot if useful
information. Please keep in mind that integrating your contribution may require some adjustments in your
code, if this is the case this can be discussed in the Pull Request you submit.


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
Please see the file named LICENSE.txt.
[1]: https://github.com/osisoft/contributing
