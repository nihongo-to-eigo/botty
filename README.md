# Requirements
 - Node.js > v8

 You just need to do:

 ```
 npm i
 node start.js
 ```

You can just create an empty feathers.json file in the root of the project.

Here is an example `config.json` file as well:
```
{
  "prefix": "[",
  "playing": "Try %prefixhelp ;)",
  "description": "This is a test instance to test new features and debug current ones.",
  "administrators": [
      "ID of ADMIN"
  ],
  "log_channel":"",
  "voice_channel": "",
  "voice_channel_chat": "",
  "api": {
    "discord_token": "<bot token>"
  }
}
```