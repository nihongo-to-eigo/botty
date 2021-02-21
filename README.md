# Requirements
 * Node.js LTS

## First Time Instructions
 **Make sure you have Discord open so you can copy the necessary IDs from Discord when running `node setup.js`**
 ```
 npm i
 node setup.js
 ```

You can just create an empty `feathers.json` file in the root of the project.

Create a `config.json` file based off of this example:
```
{
  "prefix": "[",
  "playing": "Try %prefixhelp ;)",
  "description": "This is a test instance to test new features and debug current ones.",
  "administrators": [
      "ID of ADMIN"
  ],
  "api": {
    "discord_token": "<bot token>"
  }
}
```

# Features
 * Clock system to use for timed events
   * Currently is used for timed mutes
 * [Permission system](/documentation/Permissions.md)
 * Ability to add functions to run when the bot is ready [Docs](/documentation/FunctionInjection.md)
 * [Infraction system](/documentation/InfractionSystem.md)
 * Light DB using `nedb`
   * The DB stores permissions, roles for auto-roles, tags, infractions