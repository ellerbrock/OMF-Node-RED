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
	
    function LowerCaseNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
		
		this.typeid = config.typeid;
		this.classification = config.classification;
		this.version = config.version;
		this.typename = config.typename;
		this.description = config.description;
		this.tags = config.tags;
		this.metadata = config.metadata;
		
		this.properties = config.properties;
		
		this.Switch = config.Switch;
		this.Save = config.Save;
    }
	
    RED.nodes.registerType("osisoft-omf-type-bridge",LowerCaseNode);
}