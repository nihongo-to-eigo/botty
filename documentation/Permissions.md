# Summary
There are 3 base levels of permissions that are allowable by adding DB entries and 1 that is an "admin" setting.

The levels are:
 * private - Set in the config file as `administrator`: has access to any and all commands
 * high - Set via DB: Has access to `high` and lower commands
 * low - Set via DB: Has access to `low` and lower commands
 * public - Anyone can access these commands

## Administrator
This setting is still a remnant of the old config file that was being used when the bot was first set up. For this one, you just have to add your user ID to the `administrators` array in `config.json`

## Setting Permission Levels
 For setting up `high` and `low` in the Db, you'll have to use the setup script.

Make sure you ran the `setup.js` file before using the `setperms` command.

Once you used the setup script to enter those 2, you can use the setperms command like so: `setperms high role <role ID>` for `high` and then `setperms low role <role ID>` for `low`.