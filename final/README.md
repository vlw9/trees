# final

Victoria Wu vlw9

Started on 4/13, finished on 4/29, est. 40 hours

Worked with no one

Resources? - firebase documentation

Bugs/concerns -
There is a bug where sometimes when you click on the x to remove a work, it doesn't automatically go and if you try to click on it
again, you'll get an error because you HAVE removed it and there's
nothing to remove, even if you see it. This happens rarely though,
and it's more of a matter of firebase choosing not to refresh
automatically sometimes.

how the admin password works - Admin password is stored in firebase
as the author of the 0th card of the 0th list. Needless to say if you
remove the 0th card from the 0th list then you will get an error when
attempting to log in as the administrator.

other notes - I know it's pretty inefficient to check for page == 2
or 3 each time; at one point I made a global var that would adjust
according to this.page so that I wouldn't have to make each of the
methods work in terms of writing to lists or pages, but there was
always one small bug that I couldn't overcome, so finally I just bit
my teeth and did it manually. At least it worked! In the future if I
have more time I'd love to go back and shorten the code and have it
achieve the same before adding more capabilities.

All background image credit goes to respective photographers featured
in the windows 10 spotlight images! 
