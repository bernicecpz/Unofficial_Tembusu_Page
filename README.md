# The Unofficial Tembusu Page
17 July 2017: Integration of 2 main features, dashboard + search function   <br />
26 June 2017: Integration with Calendar  <br />
29 May 2017: Development of main, login and register page; Routing is established with Iron Router. Mailgun is used as SMTP provider.

# Setting up steps
Enter the following commands in order :
+ Run the following command __"npm install all"__ to download all the packages as listed in package.json. Ignore the warning message that is displayed after the installation is completed.
  - Run __"meteor install --save bcrypt"__ to resolve warning message.
+ When running the project for the first time, it will take some time to link up all the modules. You should only get the warning message that recommends you to install the native implementation of bcrypt, when you execute the project.
+ Install the native implementation as recommended by opening another terminal. Do not close the terminal as the next few commands can be executed there.
+ Retrieve the Meteor Mongo database URL with the following command __"meteor mongo --url"__. The output will be used in the next command for the "--host" parameter.
+ Import the collections with the command and fill in the parameters accordingly:
  - __"mongoimport --host=[address:port] /d [database name] /c [collection name] /file [JSON filename]"__ (For Windows)
  - __"mongoimport --host [address:port] --db [database name] --collection [collection name] --file [JSON filename]"__ (For Linux/Unix)
  - Note that the JSON files can be found under the "DB import collections" folder
  - To know which database you are using, enter "db" into the database. "meteor" is the default database.  

# Backing up the database steps
+ To export existing collection, use the following command:
  - __"mongoexport --host=[address:port] /d [database name] /c [collection name] /o [JSON filename]"__ (For Windows)
  - __"mongoexport --host [address:port] --db [database name] --collection [collection name] --output [JSON filename]"__ (For Linux/Unix)
+ Currently, all the json files have been consolidated into the folder named, "DB import collections".


# Note to self
+ Currently, the sandbox domain is used for the SMTP. As such, only authorized recipients will be able to use the sandbox domain provided by Mailgun.
  - Need to manually include the emails that are authorized
  - Users must accept invitation in order to enroll and use UTP.
+ Limited to 100 emails / hr.

# Area(s) to note
+ __Jquery must be > version 1.9 but < 3. Install via meteor packages and not npm for twbs:bootstrap package.__
+ The end date in the calendar is exclusive. As such, there is a need to select 1 more day in order to be able to display the intended date. Need to find an allDay option to apply to dynamic events, since allDay seems to can only be set in static individual events.
+ Need to find a way to export the collections from MongoDB. [RESOLVED]
+ __"compatability" folder containing bootstrap-less has been removed to resolve its incompatability with admin-lte.__ [RESOLVED]
+ The terms "home" and "dashboard" will be used interchangeably, since the dashboard is the user's homepage.  
+ npm shrinkwrap is used in case of any packages that have a dependency of jquery 3, which may cause error of incompatability for  twbs:bootstrap   


# Meteor packages used
To find out about the packages version and description, use command - "meteor list"
accounts-base                        
accounts-password                    
aldeed:collection2                   
aldeed:simple-schema                 
blaze-html-templates                 
check                                
cunneen:mailgun                      
dangrossman:bootstrap-daterangepicker
ecmascript                           
ejson                                
email                                
es5-shim                             
fullcalendar:fullcalendar            
huttonr:bootstrap3                   
huttonr:bootstrap3-assets            
iron:controller                      
iron:core                            
iron:dynamic-template                
iron:layout                          
iron:location                        
iron:router                          
iron:url                             
joeinnes:meteor-autolinker           
jquery                               
less                                 
meteor-base                          
mobile-experience                    
momentjs:moment                      
mongo                                
nicolaslopezj:roles                  
reactive-dict                        
reactive-var                         
redaty:admin-lte                     
session                              
shell-server                         
standard-minifier-css                
standard-minifier-js                 
templating                           
themeteorchef:bert                   
themeteorchef:jquery-validation      
tracker                              
twbs:bootstrap                       