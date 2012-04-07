C&C Clone
=========

HTML5 Canvas game based on C&C, with multiplayer support.
Also using Node.js & Socket.io (eventually).

Started:

- Tank Movement (WASD) - Need to fix to viewpoint limits.

To Do:

- Graphics:
  * Proper tank image.
  * Background: grass tiles.

- Code:
  * Add multiplayer support.
  * Add firing mechanism.

- To Fix:
  * Viewpoint limits.

And much, much, more to come...

Change Log

* FIXED: Tank Drawn: Issue with flickering / flashing of tank when redrawn.
* ADDED: Canvas Clicks
  * Selection of units (tanks) / check if unit under cursor.
  * Move to location if unit already selected.
  * Right-click removed 'context menu'.
* ADDED: Mousemove
  * Cursor change if mouseover unit (to 'pointer') - needs custom cursor.
* ADDED: Unit Movement
  * Basic movement calculation, in use and working.
  * Advanced movement calculation => commented out as only currently works positive X, Y.
* ADDED: Game Initialisation
  * Create players
  * Add units to player 1 (p1).
* ADDED: General improvements.

