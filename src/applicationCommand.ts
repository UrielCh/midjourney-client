import { Command } from "./models.ts";

// midjourney bot id
export const application_id = "936929561302675456";

// image_application_command
export const imagine: Command = {
    id: "938956540159881230",
    application_id,
    version: "1077969938624553050",
    default_member_permissions: null,
    type: 1,
    nsfw: false,
    name: "imagine",
    description: "Create images with Midjourney",
    dm_permission: true,
    contexts: null,
    options: [
        {
            type: 3,
            name: "prompt",
            description: "The prompt to imagine",
            required: true
        }
    ]
};

export const settings: Command = {
    id: "1000850743479255081",
    application_id,
    version: "1001470153961259108",
    default_member_permissions: null,
    type: 1,
    nsfw: false,
    name: "settings",
    description: "View and adjust your personal settings.",
    dm_permission: true,
    contexts: null
};


