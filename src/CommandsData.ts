export const CommandsData = {
  "application_commands": [
    {
      "id": "991751594662170664",
      "type": 1,
      "application_id": "990755437722894396",
      "version": "1050818524563644486",
      "name": "answer",
      "description": "Get an answer to a question.",
      "options": [
        {
          "type": 3,
          "name": "question",
          "description": "What is the question?",
          "required": true,
        },
        {
          "type": 6,
          "name": "mention",
          "description": "…",
          "required": false,
        },
      ],
      "dm_permission": true,
      "integration_types": [
        0,
      ],
      "global_popularity_rank": 1,
    },
    {
      "id": "1074812724166545448",
      "type": 1,
      "application_id": "990755437722894396",
      "version": "1076155494680498228",
      "name": "docs",
      "description": "View the documentation.",
      "options": [
        {
          "type": 3,
          "name": "doc",
          "description": "The documentation page you want to view.",
          "required": true,
          "autocomplete": true,
        },
        {
          "type": 6,
          "name": "mention",
          "description": "The user you want to mention.",
          "required": false,
        },
      ],
      "dm_permission": true,
      "integration_types": [
        0,
      ],
      "global_popularity_rank": 2,
    },
    {
      "id": "1076155494680498227",
      "type": 1,
      "application_id": "990755437722894396",
      "version": "1076155494680498229",
      "name": "faq",
      "description": "Link to a FAQ thread.",
      "options": [
        {
          "type": 3,
          "name": "faq",
          "description": "The FAQ thread you want to link.",
          "required": true,
          "autocomplete": true,
        },
        {
          "type": 6,
          "name": "mention",
          "description": "The user you want to mention.",
          "required": false,
        },
      ],
      "dm_permission": true,
      "integration_types": [
        0,
      ],
      "global_popularity_rank": 3,
    },
    {
      "id": "1090367768383197384",
      "type": 1,
      "application_id": "990755437722894396",
      "version": "1090367768383197385",
      "name": "synonyms",
      "description": "Find synonyms for a word.",
      "options": [
        {
          "type": 3,
          "name": "word",
          "description": "The word you want to find synonyms for.",
          "required": true,
          "autocomplete": true,
        },
      ],
      "dm_permission": true,
      "integration_types": [
        0,
      ],
      "global_popularity_rank": 4,
    },
    {
      "id": "938956540159881230",
      "type": 1,
      "application_id": "936929561302675456",
      "version": "1237876415471554623",
      "name": "imagine",
      "description": "Create images with Midjourney",
      "options": [
        {
          "type": 3,
          "name": "prompt",
          "description": "The prompt to imagine",
          "required": true,
        },
      ],
      "dm_permission": true,
      "contexts": [
        0,
        1,
        2,
      ],
      "integration_types": [
        0,
        1,
      ],
      "global_popularity_rank": 1,
    },
    {
      "id": "941673664900898876",
      "type": 1,
      "application_id": "936929561302675456",
      "version": "1237876415471554629",
      "name": "help",
      "description": "Shows help for the bot.",
      "dm_permission": true,
      "contexts": [
        0,
        1,
        2,
      ],
      "integration_types": [
        0,
        1,
      ],
      "global_popularity_rank": 14,
    },
    {
      "id": "972289487818334209",
      "type": 1,
      "application_id": "936929561302675456",
      "version": "1237876415735660565",
      "name": "info",
      "description": "View information about your profile.",
      "dm_permission": true,
      "contexts": [
        0,
        1,
        2,
      ],
      "integration_types": [
        0,
        1,
      ],
      "global_popularity_rank": 2,
    },
    {
      "id": "972289487818334210",
      "type": 1,
      "application_id": "936929561302675456",
      "version": "1237876415735660570",
      "name": "private",
      "description": "Toggle stealth mode",
      "dm_permission": true,
      "contexts": [
        0,
        1,
      ],
      "integration_types": [
        0,
      ],
      "global_popularity_rank": 16,
    },
    {
      "id": "972289487818334211",
      "type": 1,
      "application_id": "936929561302675456",
      "version": "1237876415735660571",
      "name": "public",
      "description": "Switch to public mode",
      "dm_permission": true,
      "contexts": [
        0,
        1,
      ],
      "integration_types": [
        0,
      ],
      "global_popularity_rank": 22,
    },
    {
      "id": "972289487818334212",
      "type": 1,
      "application_id": "936929561302675456",
      "version": "1237876415735660572",
      "name": "fast",
      "description": "Switch to fast mode",
      "dm_permission": true,
      "contexts": [
        0,
        1,
      ],
      "integration_types": [
        0,
      ],
      "global_popularity_rank": 10,
    },
    {
      "id": "972289487818334213",
      "type": 1,
      "application_id": "936929561302675456",
      "version": "1237876415735660573",
      "name": "relax",
      "description": "Switch to relax mode",
      "dm_permission": true,
      "contexts": [
        0,
        1,
      ],
      "integration_types": [
        0,
      ],
      "global_popularity_rank": 8,
    },
    {
      "id": "984273800587776053",
      "type": 1,
      "application_id": "936929561302675456",
      "version": "1237876415790055476",
      "name": "prefer",
      "description": "…",
      "options": [
        {
          "type": 2,
          "name": "option",
          "description": "…",
          "options": [
            {
              "type": 1,
              "name": "set",
              "description": "Set a custom option.",
              "options": [
                {
                  "type": 3,
                  "name": "option",
                  "description": "…",
                  "required": true,
                  "autocomplete": true,
                },
                {
                  "type": 3,
                  "name": "value",
                  "description": "…",
                  "required": false,
                },
              ],
            },
            {
              "type": 1,
              "name": "list",
              "description": "View your current custom options.",
            },
          ],
        },
        {
          "type": 1,
          "name": "auto_dm",
          "description": "Whether or not to automatically send job results to your DMs.",
        },
        {
          "type": 1,
          "name": "suffix",
          "description": "Suffix to automatically add to the end of every prompt. Leave empty to remove.",
          "options": [
            {
              "type": 3,
              "name": "new_value",
              "description": "…",
              "required": false,
            },
          ],
        },
        {
          "type": 1,
          "name": "remix",
          "description": "Toggle remix mode.",
        },
        {
          "type": 1,
          "name": "variability",
          "description": "Toggle variability mode.",
        },
      ],
      "dm_permission": true,
      "contexts": [
        0,
        1,
      ],
      "integration_types": [
        0,
      ],
      "global_popularity_rank": 7,
    },
    {
      "id": "986816068012081172",
      "type": 1,
      "application_id": "936929561302675456",
      "version": "1237876415735660567",
      "name": "invite",
      "description": "Get an invite link to the Midjourney Discord server",
      "dm_permission": true,
      "contexts": [
        0,
        1,
      ],
      "integration_types": [
        0,
      ],
      "global_popularity_rank": 20,
    },
    {
      "id": "987795925764280351",
      "type": 1,
      "application_id": "936929561302675456",
      "version": "1237876415735660568",
      "name": "subscribe",
      "description": "Subscribe to Midjourney",
      "dm_permission": true,
      "contexts": [
        0,
        1,
        2,
      ],
      "integration_types": [
        0,
        1,
      ],
      "global_popularity_rank": 9,
    },
    {
      "id": "987795925764280352",
      "type": 3,
      "application_id": "936929561302675456",
      "version": "1237876415790055477",
      "name": "Cancel Job",
      "dm_permission": true,
      "contexts": [
        0,
        1,
        2,
      ],
      "integration_types": [
        0,
        1,
      ],
    },
    {
      "id": "987795925764280353",
      "type": 3,
      "application_id": "936929561302675456",
      "version": "1237876415790055478",
      "name": "DM Results",
      "dm_permission": true,
      "contexts": [
        0,
        1,
        2,
      ],
      "integration_types": [
        0,
        1,
      ],
    },
    {
      "id": "991449849599885383",
      "type": 3,
      "application_id": "936929561302675456",
      "version": "1237876415790055479",
      "name": "Report Job",
      "dm_permission": false,
      "contexts": [
        0,
        2,
      ],
      "integration_types": [
        0,
        1,
      ],
    },
    {
      "id": "994261739745050684",
      "type": 1,
      "application_id": "936929561302675456",
      "version": "1237876415471554622",
      "name": "ask",
      "description": "Get an answer to a question.",
      "options": [
        {
          "type": 3,
          "name": "question",
          "description": "What is the question?",
          "required": true,
        },
      ],
      "dm_permission": true,
      "contexts": [
        0,
        1,
        2,
      ],
      "integration_types": [
        0,
        1,
      ],
      "global_popularity_rank": 11,
    },
    {
      "id": "1000850743479255081",
      "type": 1,
      "application_id": "936929561302675456",
      "version": "1237876415790055475",
      "name": "settings",
      "description": "View and adjust your personal settings.",
      "dm_permission": true,
      "contexts": [
        0,
        1,
        2,
      ],
      "integration_types": [
        0,
        1,
      ],
      "global_popularity_rank": 5,
    },
    {
      "id": "1062880104792997970",
      "type": 1,
      "application_id": "936929561302675456",
      "version": "1237876415471554624",
      "name": "blend",
      "description": "Blend images together seamlessly!",
      "options": [
        {
          "type": 11,
          "name": "image1",
          "description": "First image to add to the blend",
          "required": true,
        },
        {
          "type": 11,
          "name": "image2",
          "description": "Second image to add to the blend",
          "required": true,
        },
        {
          "type": 3,
          "name": "dimensions",
          "description": "The dimensions of the image. If not specified, the image will be square.",
          "required": false,
          "choices": [
            {
              "name": "Portrait",
              "value": "--ar 2:3",
            },
            {
              "name": "Square",
              "value": "--ar 1:1",
            },
            {
              "name": "Landscape",
              "value": "--ar 3:2",
            },
          ],
        },
        {
          "type": 11,
          "name": "image3",
          "description": "Third image to add to the blend (optional)",
          "required": false,
        },
        {
          "type": 11,
          "name": "image4",
          "description": "Fourth image to add to the blend (optional)",
          "required": false,
        },
        {
          "type": 11,
          "name": "image5",
          "description": "Fifth image to add to the blend (optional)",
          "required": false,
        },
      ],
      "dm_permission": true,
      "contexts": [
        0,
        1,
        2,
      ],
      "integration_types": [
        0,
        1,
      ],
      "global_popularity_rank": 4,
    },
    {
      "id": "1065569343456419860",
      "type": 1,
      "application_id": "936929561302675456",
      "version": "1237876415735660569",
      "name": "stealth",
      "description": "Toggle stealth mode",
      "dm_permission": true,
      "contexts": [
        0,
        1,
      ],
      "integration_types": [
        0,
      ],
      "global_popularity_rank": 15,
    },
    {
      "id": "1092492867185950852",
      "type": 1,
      "application_id": "936929561302675456",
      "version": "1237876415471554625",
      "name": "describe",
      "description": "Writes a prompt based on your image.",
      "options": [
        {
          "type": 11,
          "name": "image",
          "description": "The image to describe",
          "required": false,
        },
        {
          "type": 3,
          "name": "link",
          "description": "…",
          "required": false,
        },
      ],
      "dm_permission": true,
      "contexts": [
        0,
        1,
        2,
      ],
      "integration_types": [
        0,
        1,
      ],
      "global_popularity_rank": 3,
    },
    {
      "id": "1121575372539039774",
      "type": 1,
      "application_id": "936929561302675456",
      "version": "1237876415471554626",
      "name": "shorten",
      "description": "Analyzes and shortens a prompt.",
      "options": [
        {
          "type": 3,
          "name": "prompt",
          "description": "The prompt to shorten",
          "required": true,
        },
      ],
      "dm_permission": true,
      "contexts": [
        0,
        1,
      ],
      "integration_types": [
        0,
      ],
      "global_popularity_rank": 12,
    },
    {
      "id": "1124132684143271996",
      "type": 1,
      "application_id": "936929561302675456",
      "version": "1237876415790055474",
      "name": "turbo",
      "description": "Switch to turbo mode",
      "dm_permission": true,
      "contexts": [
        0,
        1,
      ],
      "integration_types": [
        0,
      ],
      "global_popularity_rank": 17,
    },
    {
      "id": "1136041075614683196",
      "type": 1,
      "application_id": "936929561302675456",
      "version": "1237876415735660566",
      "name": "userid",
      "description": "Get your user ID",
      "dm_permission": true,
      "contexts": [
        0,
        1,
        2,
      ],
      "integration_types": [
        0,
        1,
      ],
      "global_popularity_rank": 19,
    },
    {
      "id": "1169435442328911902",
      "type": 1,
      "application_id": "936929561302675456",
      "version": "1237876415471554630",
      "name": "show",
      "description": "Shows the job view based on job id.",
      "options": [
        {
          "type": 3,
          "name": "job_id",
          "description": "The job ID of the job you want to show. It should look similar to this:…",
          "required": true,
        },
      ],
      "dm_permission": true,
      "contexts": [
        0,
        1,
      ],
      "integration_types": [
        0,
      ],
      "global_popularity_rank": 6,
    },
    {
      "id": "1169440360339091476",
      "type": 1,
      "application_id": "936929561302675456",
      "version": "1237876415471554627",
      "name": "tune",
      "description": "Create a shareable style tuner based on a prompt.",
      "options": [
        {
          "type": 3,
          "name": "prompt",
          "description": "The base prompt to use for the tuner",
          "required": true,
        },
      ],
      "dm_permission": true,
      "contexts": [
        0,
        1,
      ],
      "integration_types": [
        0,
      ],
      "global_popularity_rank": 13,
    },
    {
      "id": "1181338718158721086",
      "type": 1,
      "application_id": "936929561302675456",
      "version": "1237876415471554628",
      "name": "list_tuners",
      "description": "List your tuners!",
      "dm_permission": true,
      "contexts": [
        0,
        1,
      ],
      "integration_types": [
        0,
      ],
      "global_popularity_rank": 18,
    },
    {
      "id": "1199869998538162256",
      "type": 1,
      "application_id": "936929561302675456",
      "version": "1237876415735660564",
      "name": "feedback",
      "description": "Submit your feedback!",
      "dm_permission": true,
      "contexts": [
        0,
        1,
      ],
      "integration_types": [
        0,
      ],
      "global_popularity_rank": 21,
    },
    {
      "id": "1233749904279736400",
      "type": 1,
      "application_id": "1179783757507612752",
      "version": "1233749904279736401",
      "name": "dump_reviews",
      "description": "…",
      "dm_permission": true,
      "integration_types": [
        0,
      ],
      "global_popularity_rank": 1,
    },
    {
      "id": "987316865007251510",
      "type": 1,
      "application_id": "936929561302675456",
      "guild_id": "662267976984297473",
      "version": "1100555546274304051",
      "name": "ban_word",
      "description": "Ban a word from being used in the prompt.",
      "options": [
        {
          "type": 3,
          "name": "word",
          "description": "The word to ban",
          "required": true,
        },
        {
          "type": 4,
          "name": "weight",
          "description": "How strong the ban is",
          "required": false,
          "choices": [
            {
              "name": "Soft ban (bikini)",
              "value": 0,
            },
            {
              "name": "Light ban (blood)",
              "value": 1,
            },
            {
              "name": "Medium ban (default)",
              "value": 2,
            },
            {
              "name": "Heavy ban (slurs)",
              "value": 3,
            },
          ],
        },
        {
          "type": 4,
          "name": "flags",
          "description": "Flags to apply to the banned word",
          "required": false,
          "choices": [
            {
              "name": "No flags (default)",
              "value": 0,
            },
            {
              "name": "Allow in v4",
              "value": 1,
            },
            {
              "name": "Ban in v5",
              "value": 2,
            },
            {
              "name": "Ban in Negative Prompts",
              "value": 4,
            },
            {
              "name": "Hard ban for LLMs",
              "value": 8,
            },
          ],
        },
      ],
      "integration_types": [
        0,
      ],
    },
    {
      "id": "987316865007251513",
      "type": 1,
      "application_id": "936929561302675456",
      "guild_id": "662267976984297473",
      "version": "1090916913946824795",
      "name": "status",
      "description": "Checks status of services.",
      "integration_types": [
        0,
      ],
    },
    {
      "id": "987795244739362858",
      "type": 1,
      "application_id": "936929561302675456",
      "guild_id": "662267976984297473",
      "version": "1092492870201638963",
      "name": "dot",
      "description": "Commands for debugging.",
      "default_member_permissions": "0",
      "options": [
        {
          "type": 1,
          "name": "eval",
          "description": "Evaluates python code on the bot",
          "options": [
            {
              "type": 3,
              "name": "body",
              "description": "…",
              "required": true,
            },
          ],
        },
      ],
      "integration_types": [
        0,
      ],
    },
    {
      "id": "987795244739362861",
      "type": 1,
      "application_id": "936929561302675456",
      "guild_id": "662267976984297473",
      "version": "1100555546274304052",
      "name": "ban_phrase",
      "description": "Ban a phrase from being used in the prompt.",
      "options": [
        {
          "type": 3,
          "name": "phrase",
          "description": "The phrase to ban",
          "required": true,
        },
        {
          "type": 4,
          "name": "weight",
          "description": "How strong the ban is",
          "required": false,
          "choices": [
            {
              "name": "Soft ban (bikini)",
              "value": 0,
            },
            {
              "name": "Light ban (blood)",
              "value": 1,
            },
            {
              "name": "Medium ban (default)",
              "value": 2,
            },
            {
              "name": "Heavy ban (slurs)",
              "value": 3,
            },
          ],
        },
        {
          "type": 4,
          "name": "flags",
          "description": "Flags to apply to the banned phrase",
          "required": false,
          "choices": [
            {
              "name": "No flags (default)",
              "value": 0,
            },
            {
              "name": "Allow in v4",
              "value": 1,
            },
            {
              "name": "Ban in v5",
              "value": 2,
            },
            {
              "name": "Ban in Negative Prompts",
              "value": 4,
            },
            {
              "name": "Hard ban for LLMs",
              "value": 8,
            },
          ],
        },
      ],
      "integration_types": [
        0,
      ],
    },
    {
      "id": "987795244739362862",
      "type": 1,
      "application_id": "936929561302675456",
      "guild_id": "662267976984297473",
      "version": "987795244877762654",
      "name": "reset_cooldown",
      "description": "Reset a user's cooldown.",
      "options": [
        {
          "type": 6,
          "name": "user",
          "description": "Reset cooldown of a user",
          "required": true,
        },
      ],
      "integration_types": [
        0,
      ],
    },
    {
      "id": "987795244739362863",
      "type": 1,
      "application_id": "936929561302675456",
      "guild_id": "662267976984297473",
      "version": "1225301590727200881",
      "name": "ability",
      "description": "Set a user's ability.",
      "options": [
        {
          "type": 6,
          "name": "user",
          "description": "User to modify",
          "required": true,
        },
        {
          "type": 3,
          "name": "ability",
          "description": "Ability to grant or revoke",
          "required": true,
          "choices": [
            {
              "name": "Admin",
              "value": "admin",
            },
            {
              "name": "Developer",
              "value": "developer",
            },
            {
              "name": "Accepted_Tos",
              "value": "accepted_tos",
            },
            {
              "name": "Moderator",
              "value": "moderator",
            },
            {
              "name": "Guide",
              "value": "guide",
            },
            {
              "name": "VIP",
              "value": "vip",
            },
            {
              "name": "Employee",
              "value": "employee",
            },
            {
              "name": "Content_Moderator",
              "value": "content_moderator",
            },
            {
              "name": "Events",
              "value": "events",
            },
            {
              "name": "No Filter",
              "value": "allow_nsfw",
            },
            {
              "name": "Tester",
              "value": "tester",
            },
            {
              "name": "No Limits",
              "value": "cooldowns_removed",
            },
            {
              "name": "Blocked",
              "value": "blocked",
            },
            {
              "name": "Community",
              "value": "community",
            },
            {
              "name": "Billing",
              "value": "billing",
            },
            {
              "name": "Api_Access",
              "value": "api_access",
            },
            {
              "name": "Club_1K",
              "value": "club_1k",
            },
            {
              "name": "Club_2P5K",
              "value": "club_2p5k",
            },
            {
              "name": "Club_5K",
              "value": "club_5k",
            },
            {
              "name": "Club_10K",
              "value": "club_10k",
            },
            {
              "name": "Club_25K",
              "value": "club_25k",
            },
          ],
        },
        {
          "type": 5,
          "name": "grant",
          "description": "Grant or revoke",
          "required": true,
        },
      ],
      "integration_types": [
        0,
      ],
    },
    {
      "id": "987795244739362864",
      "type": 1,
      "application_id": "936929561302675456",
      "guild_id": "662267976984297473",
      "version": "987795244877762657",
      "name": "sync",
      "description": "Sync all commands.",
      "integration_types": [
        0,
      ],
    },
    {
      "id": "987826107137007668",
      "type": 1,
      "application_id": "936929561302675456",
      "guild_id": "662267976984297473",
      "version": "1204231438682161203",
      "name": "user_info",
      "description": "Get information about a user.",
      "options": [
        {
          "type": 6,
          "name": "recipient",
          "description": "…",
          "required": true,
        },
        {
          "type": 5,
          "name": "times",
          "description": "…",
          "required": false,
        },
      ],
      "integration_types": [
        0,
      ],
    },
    {
      "id": "990015407198978068",
      "type": 1,
      "application_id": "936929561302675456",
      "guild_id": "662267976984297473",
      "version": "1084880306798067712",
      "name": "contact",
      "description": "Send a message to a user through the bot, requiring acknowledgment.",
      "options": [
        {
          "type": 6,
          "name": "user",
          "description": "User to contact",
          "required": true,
        },
        {
          "type": 3,
          "name": "message",
          "description": "Message to send",
          "required": true,
        },
        {
          "type": 5,
          "name": "reset_jobs",
          "description": "Wipe queue and cancel all running jobs",
          "required": false,
        },
      ],
      "integration_types": [
        0,
      ],
    },
    {
      "id": "993558757659381892",
      "type": 1,
      "application_id": "936929561302675456",
      "guild_id": "662267976984297473",
      "version": "1087986004801106020",
      "name": "block",
      "description": "…",
      "options": [
        {
          "type": 6,
          "name": "user",
          "description": "User to block",
          "required": true,
        },
        {
          "type": 3,
          "name": "message",
          "description": "Reason for blocking, shown to user",
          "required": false,
        },
        {
          "type": 5,
          "name": "ban",
          "description": "…",
          "required": false,
        },
        {
          "type": 4,
          "name": "until",
          "description": "Date to unblock",
          "required": false,
          "choices": [
            {
              "name": "Remove timeout",
              "value": 0,
            },
            {
              "name": "15 minutes",
              "value": 900,
            },
            {
              "name": "1 hour",
              "value": 3600,
            },
            {
              "name": "6 hours",
              "value": 21600,
            },
            {
              "name": "1 day",
              "value": 86400,
            },
            {
              "name": "1 week",
              "value": 604800,
            },
            {
              "name": "2 weeks",
              "value": 1209600,
            },
            {
              "name": "1 month",
              "value": 2592000,
            },
          ],
        },
      ],
      "integration_types": [
        0,
      ],
    },
    {
      "id": "1001470154762371142",
      "type": 1,
      "application_id": "936929561302675456",
      "guild_id": "662267976984297473",
      "version": "1001470154762371143",
      "name": "transfer",
      "description": "Transfer a user's account to another user.",
      "options": [
        {
          "type": 6,
          "name": "old_user",
          "description": "Account to transfer from",
          "required": true,
        },
        {
          "type": 6,
          "name": "new_user",
          "description": "Account to transfer to",
          "required": true,
        },
      ],
      "integration_types": [
        0,
      ],
    },
    {
      "id": "1004071042614034533",
      "type": 1,
      "application_id": "936929561302675456",
      "guild_id": "662267976984297473",
      "version": "1136041078596841614",
      "name": "theme",
      "description": "Channel theme commands.",
      "options": [
        {
          "type": 1,
          "name": "show",
          "description": "Show the current channel theme.",
        },
        {
          "type": 1,
          "name": "set",
          "description": "Set the required words for this channel.",
          "options": [
            {
              "type": 3,
              "name": "words",
              "description": "Words to require",
              "required": true,
            },
          ],
        },
        {
          "type": 1,
          "name": "set_words",
          "description": "Set the required number of words for this channel.",
          "options": [
            {
              "type": 4,
              "name": "words",
              "description": "The amount of words to require",
              "required": true,
              "min_value": 0,
              "max_value": 50,
            },
          ],
        },
      ],
      "integration_types": [
        0,
      ],
    },
    {
      "id": "1027545630316449902",
      "type": 1,
      "application_id": "936929561302675456",
      "guild_id": "662267976984297473",
      "version": "1220852797160030409",
      "name": "credits",
      "description": "Manage member credits.",
      "options": [
        {
          "type": 1,
          "name": "add",
          "description": "If 'expiring', expiration is 30 days from now. 'reason' is required for 'expiring'.",
          "options": [
            {
              "type": 6,
              "name": "user",
              "description": "…",
              "required": true,
            },
            {
              "type": 4,
              "name": "amount",
              "description": "…",
              "required": true,
              "autocomplete": true,
            },
            {
              "type": 3,
              "name": "type",
              "description": "…",
              "required": true,
              "choices": [
                {
                  "name": "rollover",
                  "value": "rollover",
                },
                {
                  "name": "expiring",
                  "value": "expiring",
                },
              ],
            },
            {
              "type": 3,
              "name": "reason",
              "description": "…",
              "required": false,
            },
          ],
        },
        {
          "type": 1,
          "name": "set",
          "description": "Admin command to set job credits for a user. Credits expire at the end of the billing period.",
          "options": [
            {
              "type": 6,
              "name": "recipient",
              "description": "User to set credits for",
              "required": true,
            },
            {
              "type": 4,
              "name": "amount",
              "description": "Amount of credits to set (60,000 credits = 1 gpu minute)",
              "required": true,
              "autocomplete": true,
            },
          ],
        },
      ],
      "integration_types": [
        0,
      ],
    },
    {
      "id": "1062218390170767413",
      "type": 1,
      "application_id": "936929561302675456",
      "guild_id": "662267976984297473",
      "version": "1204231438682161204",
      "name": "mj_info",
      "description": "Get information about a Midjourney user.",
      "options": [
        {
          "type": 3,
          "name": "uuid",
          "description": "…",
          "required": true,
        },
        {
          "type": 5,
          "name": "times",
          "description": "…",
          "required": false,
        },
      ],
      "integration_types": [
        0,
      ],
    },
    {
      "id": "1063659867535061012",
      "type": 1,
      "application_id": "936929561302675456",
      "guild_id": "662267976984297473",
      "version": "1063659867535061013",
      "name": "billing",
      "description": "Billing Command.",
      "options": [
        {
          "type": 6,
          "name": "user",
          "description": "User to run the command on",
          "required": true,
        },
        {
          "type": 3,
          "name": "command",
          "description": "Billing Command",
          "required": true,
          "choices": [
            {
              "name": "Full Refund",
              "value": "refund_full",
            },
            {
              "name": "Prorated Refund",
              "value": "refund_prorate",
            },
            {
              "name": "Stripe Sync",
              "value": "stripe_sync",
            },
          ],
        },
      ],
      "integration_types": [
        0,
      ],
    },
    {
      "id": "1070758435576098928",
      "type": 2,
      "application_id": "936929561302675456",
      "guild_id": "662267976984297473",
      "version": "1070758435576098929",
      "name": "User Info",
      "integration_types": [
        0,
      ],
    },
    {
      "id": "1086718653644423188",
      "type": 1,
      "application_id": "936929561302675456",
      "guild_id": "662267976984297473",
      "version": "1086718653644423189",
      "name": "unban",
      "description": "Unban a word from being used in the prompt.",
      "options": [
        {
          "type": 3,
          "name": "word",
          "description": "The word to unban",
          "required": true,
        },
      ],
      "integration_types": [
        0,
      ],
    },
    {
      "id": "1087185093505863682",
      "type": 1,
      "application_id": "936929561302675456",
      "guild_id": "662267976984297473",
      "version": "1087185093505863685",
      "name": "check_word",
      "description": "Check if a word is banned.",
      "options": [
        {
          "type": 3,
          "name": "word",
          "description": "The word or phrase to check",
          "required": true,
        },
      ],
      "integration_types": [
        0,
      ],
    },
    {
      "id": "1100555546274304050",
      "type": 1,
      "application_id": "936929561302675456",
      "guild_id": "662267976984297473",
      "version": "1208373950900604988",
      "name": "llm",
      "description": "LLM commands.",
      "options": [
        {
          "type": 1,
          "name": "run",
          "description": "Run a prompt through LLM.",
          "options": [
            {
              "type": 3,
              "name": "prompt",
              "description": "Prompt to run through LLM",
              "required": true,
            },
            {
              "type": 3,
              "name": "model",
              "description": "LLM model to use",
              "required": true,
              "choices": [
                {
                  "name": "Anthropic (Default)",
                  "value": "anthropic",
                },
                {
                  "name": "GPT-4",
                  "value": "gpt4",
                },
                {
                  "name": "GPT-3.5-turbo",
                  "value": "gpt3.5-turbo",
                },
                {
                  "name": "GPT-3.5-finetune",
                  "value": "gpt3.5-finetune",
                },
                {
                  "name": "Hive",
                  "value": "hive-finetune",
                },
              ],
            },
          ],
        },
        {
          "type": 1,
          "name": "decision",
          "description": "Get an existing decision for a prompt.",
          "options": [
            {
              "type": 3,
              "name": "prompt",
              "description": "Prompt you want to check the decision for",
              "required": true,
            },
            {
              "type": 3,
              "name": "model",
              "description": "LLM model used to check",
              "required": true,
              "choices": [
                {
                  "name": "Anthropic (Default)",
                  "value": "anthropic",
                },
                {
                  "name": "GPT-4",
                  "value": "gpt4",
                },
                {
                  "name": "GPT-3.5-turbo",
                  "value": "gpt3.5-turbo",
                },
                {
                  "name": "GPT-3.5-finetune",
                  "value": "gpt3.5-finetune",
                },
                {
                  "name": "Hive",
                  "value": "hive-finetune",
                },
              ],
            },
          ],
        },
        {
          "type": 1,
          "name": "appeals",
          "description": "Get all appeals for a user.",
          "options": [
            {
              "type": 6,
              "name": "user",
              "description": "User to get appeals for",
              "required": true,
            },
          ],
        },
        {
          "type": 2,
          "name": "prompt",
          "description": "LLM commands.",
          "options": [
            {
              "type": 1,
              "name": "show",
              "description": "Show the current moderator prompt.",
              "options": [
                {
                  "type": 3,
                  "name": "model",
                  "description": "Model to show the prompt for",
                  "required": true,
                  "choices": [
                    {
                      "name": "Anthropic (Default)",
                      "value": "anthropic",
                    },
                    {
                      "name": "GPT-4",
                      "value": "oai",
                    },
                  ],
                },
              ],
            },
            {
              "type": 1,
              "name": "set",
              "description": "Set the current moderator prompt.",
              "options": [
                {
                  "type": 3,
                  "name": "model",
                  "description": "Model to set the prompt for",
                  "required": true,
                  "choices": [
                    {
                      "name": "Anthropic (Default)",
                      "value": "anthropic",
                    },
                    {
                      "name": "GPT-4",
                      "value": "oai",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      "integration_types": [
        0,
      ],
    },
    {
      "id": "1106043353256169562",
      "type": 1,
      "application_id": "936929561302675456",
      "guild_id": "662267976984297473",
      "version": "1106043353256169563",
      "name": "guild_unban",
      "description": "Unban a user from the main guild.",
      "options": [
        {
          "type": 6,
          "name": "user",
          "description": "User to unban",
          "required": true,
        },
      ],
      "integration_types": [
        0,
      ],
    },
    {
      "id": "1136041078596841613",
      "type": 2,
      "application_id": "936929561302675456",
      "guild_id": "662267976984297473",
      "version": "1136041078596841615",
      "name": "Contact",
      "integration_types": [
        0,
      ],
    },
    {
      "id": "1153760508722290708",
      "type": 1,
      "application_id": "936929561302675456",
      "guild_id": "662267976984297473",
      "version": "1153760508722290709",
      "name": "alert_codes",
      "description": "Show current alert codes.",
      "integration_types": [
        0,
      ],
    },
    {
      "id": "1166847116644208650",
      "type": 1,
      "application_id": "936929561302675456",
      "guild_id": "662267976984297473",
      "version": "1166847116644208651",
      "name": "block_mj",
      "description": "…",
      "options": [
        {
          "type": 3,
          "name": "mj_id",
          "description": "User to block",
          "required": true,
        },
        {
          "type": 3,
          "name": "message",
          "description": "Reason for blocking, shown to user",
          "required": false,
        },
        {
          "type": 5,
          "name": "ban",
          "description": "…",
          "required": false,
        },
        {
          "type": 4,
          "name": "until",
          "description": "Date to unblock",
          "required": false,
          "choices": [
            {
              "name": "Remove timeout",
              "value": 0,
            },
            {
              "name": "15 minutes",
              "value": 900,
            },
            {
              "name": "1 hour",
              "value": 3600,
            },
            {
              "name": "6 hours",
              "value": 21600,
            },
            {
              "name": "1 day",
              "value": 86400,
            },
            {
              "name": "1 week",
              "value": 604800,
            },
            {
              "name": "2 weeks",
              "value": 1209600,
            },
            {
              "name": "1 month",
              "value": 2592000,
            },
          ],
        },
      ],
      "integration_types": [
        0,
      ],
    },
    {
      "id": "1169436080525803520",
      "type": 1,
      "application_id": "936929561302675456",
      "guild_id": "662267976984297473",
      "version": "1169436080525803521",
      "name": "block_quiz",
      "description": "Block a tuner from being used.",
      "options": [
        {
          "type": 3,
          "name": "tuner",
          "description": "Tuner to block",
          "required": true,
        },
      ],
      "integration_types": [
        0,
      ],
    },
    {
      "id": "1199606852204380180",
      "type": 1,
      "application_id": "936929561302675456",
      "guild_id": "662267976984297473",
      "version": "1199606852204380181",
      "name": "classify",
      "description": "Classify commands.",
      "options": [
        {
          "type": 1,
          "name": "url",
          "description": "…",
          "options": [
            {
              "type": 3,
              "name": "url",
              "description": "URL to classify",
              "required": true,
            },
            {
              "type": 5,
              "name": "cached",
              "description": "Use cached results. Will not receive scores.",
              "required": false,
            },
            {
              "type": 3,
              "name": "classifier",
              "description": "…",
              "required": false,
              "autocomplete": true,
            },
          ],
        },
      ],
      "integration_types": [
        0,
      ],
    },
    {
      "id": "1205474065415016468",
      "type": 1,
      "application_id": "936929561302675456",
      "guild_id": "662267976984297473",
      "version": "1205474065415016469",
      "name": "survey",
      "description": "Start a survey!",
      "options": [
        {
          "type": 3,
          "name": "question",
          "description": "…",
          "required": true,
        },
        {
          "type": 5,
          "name": "ordered",
          "description": "…",
          "required": true,
        },
        {
          "type": 4,
          "name": "min_word_count",
          "description": "…",
          "required": false,
        },
        {
          "type": 4,
          "name": "max_word_count",
          "description": "…",
          "required": false,
        },
      ],
      "integration_types": [
        0,
      ],
    },
    {
      "id": "1209614547468689429",
      "type": 2,
      "application_id": "936929561302675456",
      "guild_id": "662267976984297473",
      "version": "1209614547468689430",
      "name": "Stripe sync",
      "integration_types": [
        0,
      ],
    },
    {
      "id": "1224851567392592043",
      "type": 1,
      "application_id": "936929561302675456",
      "guild_id": "662267976984297473",
      "version": "1224851567392592044",
      "name": "contact_mj",
      "description": "Send a message to a user through the bot, requiring acknowledgment (using Midjourney ID).",
      "options": [
        {
          "type": 3,
          "name": "user_id",
          "description": "User to contact",
          "required": true,
        },
        {
          "type": 3,
          "name": "message",
          "description": "Message to send",
          "required": true,
        },
        {
          "type": 5,
          "name": "reset_jobs",
          "description": "Wipe queue and cancel all running jobs",
          "required": false,
        },
      ],
      "integration_types": [
        0,
      ],
    },
    {
      "id": "1022110771011932190",
      "type": 1,
      "application_id": "990755437722894396",
      "guild_id": "662267976984297473",
      "version": "1022111322835529739",
      "name": "daily_theme",
      "description": "Toggle participating in daily theme.",
      "options": [
        {
          "type": 3,
          "name": "participate",
          "description": "Do you want to get pinged when a new daily theme is released?",
          "required": true,
          "choices": [
            {
              "name": "Yes",
              "value": "yes",
            },
            {
              "name": "No",
              "value": "no",
            },
          ],
        },
      ],
      "integration_types": [
        0,
      ],
    },
  ],
  "version": "1240021480897511445",
};
