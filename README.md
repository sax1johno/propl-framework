Propl Framework
====
The Propl framework is a modern component-oriented web-framework for node.js based on express.js.
A propl app is comprised of a number of independent components, each capable of existing
on their own as a running web application.  The components are all express subapps
which are mounted to various routes based on a number of rules (including the name 
of the component file and route).

This architecture allows developers to create robust apps that are just at home as
micro-services behind an API gateway as they are in a monolithic application environment.

Functionality is added to a propl application through the addition of other app components,
each of which can interact with each other in various ways.

The application structure is as follows:

TBD

License
======
This application is licensed under the MIT open source license.