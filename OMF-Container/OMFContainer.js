/*
Copyright 2017 Derek Endres - OSIsoft, LLC
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
<http://www.apache.org/licenses/LICENSE-2.0>
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

module.exports = function(RED) {
	  "use strict";
	
    var mustache = require("mustache");
	
	 function NodeContext(msg, nodeContext, parent, escapeStrings) {
        this.msgContext = new mustache.Context(msg,parent);
        this.nodeContext = nodeContext;
        this.escapeStrings = escapeStrings;
    }
	

    NodeContext.prototype = new mustache.Context();

    NodeContext.prototype.lookup = function (name) {
        // try message first:
        try {
            var value = this.msgContext.lookup(name);
            if (value !== undefined) {
                if (this.escapeStrings && typeof value === "string") {
                    value = value.replace(/\\/g, "\\\\");
                    value = value.replace(/\n/g, "\\n");
                    value = value.replace(/\t/g, "\\t");
                    value = value.replace(/\r/g, "\\r");
                    value = value.replace(/\f/g, "\\f");
                    value = value.replace(/[\b]/g, "\\b");
                }
                return value;
            }

            // try node context:
            var dot = name.indexOf(".");
            if (dot > 0) {
                var contextName = name.substr(0, dot);
                var variableName = name.substr(dot + 1);

                if (contextName === "flow" && this.nodeContext.flow) {
                    return this.nodeContext.flow.get(variableName);
                }
                else if (contextName === "global" && this.nodeContext.global) {
                    return this.nodeContext.global.get(variableName);
                }
            }
        }catch(err) {
            throw err;
        }
    }

    NodeContext.prototype.push = function push (view) {
        return new NodeContext(view, this.nodeContext,this.msgContext);
    };
	
	var contain = "1";
	
	
    function LowerCaseNode(config) {
        RED.nodes.createNode(this,config);
		
		this.urlbridge = RED.nodes.getNode(config.urlconfig);
		this.containerconfig = RED.nodes.getNode(config.containerconfig);
		this.typeconfig = RED.nodes.getNode(config.typeconfig);
		this.headersconfig = RED.nodes.getNode(config.headersconfig);
		
        var node = this;
		
        node.on('input', function(msg) {			
			var msg1 = msg;
			
			if(this.urlbridge)	 
				 msg1.url = mustache.render(this.urlbridge.url, new NodeContext(msg, node.context(), null, true));
			 
			if(this.headersconfig) {
				msg1.headers = {};
				var props = [ "producertoken", "messagetype", "messageformat", "omfversion","action","compression"];
				for(var i = 0; i < props.length; i++){
					var prop = props[i];
					var val = this.headersconfig[prop];
					if(val)
						msg1.headers[prop] = mustache.render(val, new NodeContext(msg, node.context(), null, true));
				}
				msg1.headers.messagetype = "container";
			}
			
			if(this.containerconfig){
				var pay = null;
				if(msg.payload[0] == undefined){
					pay= [];
				}
				else{
					if(msg.payload[0].typeid !=undefined)
						pay= msg.payload;
					else
						pay= [];
				}
			//	node.warn(this.containerconfig.containerid);
				var id = mustache.render(this.containerconfig.containerid ,new NodeContext(msg, node.context(), null, true));
		//		node.warn(id);
				var typeid = mustache.render(this.containerconfig.typeid ,new NodeContext(msg, node.context(), null, true));
				var typeversion = mustache.render(this.containerconfig.typeversion ,new NodeContext(msg, node.context(), null, true));
				var friendlyname = mustache.render(this.containerconfig.friendlyname ,new NodeContext(msg, node.context(), null, true));
				var description = mustache.render(this.containerconfig.description ,new NodeContext(msg, node.context(), null, true));
				
				var tags = mustache.render(this.containerconfig.tags ,new NodeContext(msg, node.context(), null, true));
				if(typeof tags === 'string' || tags instanceof String){
					if(tags == "")
						tags = [];
					else
						tags = JSON.parse(tags);
				}
				
				var metadata = mustache.render(this.containerconfig.metadata ,new NodeContext(msg, node.context(), null, true));
				if(typeof metadata === 'string' || metadata instanceof String){
					if(metadata == "")
						metadata = {};
					else
						metadata = JSON.parse(metadata);
				}
				
				if(this.typeconfig){
					typeid = mustache.render(this.typeconfig.typeid ,new NodeContext(msg, node.context(), null, true));
					typeversion = mustache.render(this.typeconfig.version ,new NodeContext(msg, node.context(), null, true));
				}
				
				var cont = {"id" : id, "typeid" : typeid, "version" : typeversion, "description":description,"tags":tags, "metadata": metadata};
				
				
				pay.push(cont);
				
				msg.payload = pay;
			}
			
            node.send(msg1);
        });
    }
	
    RED.nodes.registerType("osisoft-omf-container",LowerCaseNode);
}