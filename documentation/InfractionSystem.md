# Summary
The bot has an infraction system that can be used to keep track of negative things for users. As of now, mutes and warns will be logged into the DB and can be viewed when running a command.

## Current Infractions
 * Mute - When a user is muted, it will store it as an infraction with the reason you added using the `mute` command.
 * Warn - When a user is warned, it will store it as an infraction with the reason you added using the `warn` command.

## Looking Up Infractions
You can use the `rapsheet` command to look infractions up by user.