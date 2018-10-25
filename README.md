#Distributed chat

Distributed chat for semestral work of DSV.

##Common requirements
- Program must (in rare occasions should) implement distributed symmetric algorithm.
- Nodes must have an interactive and a batch mode.
- Nodes must log their progress (into console and into log files)
- Log entries must have timestamp (ideally physical and logical time)
- Each node must have unique identification (use of IP and port is recommended)

##Chat
- Program will allow users (nodes) to send messages to each other. All messages must have full ordering (for synchronization use leader or mutual exclusion). All nodes must have at least these functions: send message, login, logout, crash (exit without logout).
- Presentation should be done on 5 different computers/virtuals (in case of shared filesystem, it must be run from different directories). If there is problem with system resources You can use 3 different computers/virtual (e.g. host computer and 2 virtual) but there should be at least 5 nodes (processes).

