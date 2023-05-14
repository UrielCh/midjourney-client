import { APIMessage, type Snowflake } from "../deps.ts";

type UserDetail = {
  user_id: Snowflake;
  status: "online";
  client_status: {
    web: "online";
  };
  activities: unknown[];
};

type UserDetail2 = {
  user_id: Snowflake;
  roles: Snowflake[];
  premium_since: null;
  pending: false;
  nick: null;
  mute: false;
  joined_at: string; // "2023-04-08T16:51:34.052000+00:00",
  flags: 10 | 2 | 0;
  deaf: false;
  communication_disabled_until: null;
  avatar: null;
};

type User = {
  username: string;
  public_flags: 0 | 65536;
  id: Snowflake;
  global_name: string | null;
  display_name: string | null;
  discriminator: `${number}`; // 4 digits string
  bot: boolean;
  avatar_decoration: null;
  avatar: string | null;
};

type UserFull = {
  verified: boolean;
  username: string;
  purchased_flags: 0;
  premium_type: 0;
  premium: false;
  phone: null;
  nsfw_allowed: boolean;
  mobile: true;
  mfa_enabled: false;
  id: Snowflake;
  global_name: null;
  flags: 0;
  email: `${string}@${string}`;
  display_name: null;
  discriminator: `${number}`;
  desktop: true;
  bio: string;
  banner_color: null;
  banner: null;
  avatar_decoration: null;
  avatar: string;
  accent_color: null;
};

type UserDetail3 = {
  user: User;
  roles: Snowflake[];
  premium_since: null;
  pending: false;
  nick: null;
  mute: false;
  joined_at: string; // "2023-04-08T16:51:34.052000+00:00",
  flags: 10 | 2;
  deaf: false;
  communication_disabled_until: null;
  avatar: null;
};

type VoiceStates = {
  user_id: Snowflake;
  suppress: true;
  session_id: string;
  self_video: false;
  self_mute: true;
  self_deaf: false;
  request_to_speak_timestamp: null;
  mute: false;
  deaf: false;
  channel_id: Snowflake;
};

/////////////
/////////////
/////////////

export interface WsMsg0Dispatch_1_READY {
  op: 0;
  s: 1;
  t: "READY";
  d: {
    v: 9;
    users: User[];
    user_settings_proto: string; // base64
    user_guild_settings: {
      version: 11;
      partial: false;
      entries: unknown[]; // TODO
    };
    user: UserFull; // self
    tutorial: null;
    sessions: Array<{
      status: "online";
      session_id: string;
      client_info: {
        version: 0;
        os: "windows";
        client: "web";
      };
      activities: [];
    }>;
    session_type: "normal";
    session_id: string;
    resume_gateway_url: "wss://gateway-us-east1-b.discord.gg";
    relationships: Array<{
      user_id: Snowflake;
      type: 4;
      nickname: null;
      id: Snowflake;
    }>;
    read_state: {
      version: 1520;
      partial: false;
      entries: Array<{
        id: Snowflake;
        //
        mention_count?: 0;
        last_pin_timestamp?: "1970-01-01T00:00:00+00:00";
        last_message_id?: Snowflake;
        flags?: 0;
        ///
        read_state_type?: 3;
        last_acked_id?: Snowflake;
        badge_count?: 0;
      }>;
    };
    private_channels: Array<{
      type: 1;
      recipient_ids: Snowflake[];
      last_message_id: Snowflake;
      is_spam: false;
      id: Snowflake;
      flags: 0;
    }>;
    merged_members: UserDetail2[][];
    guilds: unknown[];
    guild_join_requests: unknown[];
    guild_experiments: unknown[];
    geo_ordered_rtc_regions: string[]; //  "tel-aviv", "bucharest", "dubai", "russia", "milan"
    friend_suggestion_count: number;
    experiments: number[][];
    country_code: string; // 2 letters code
    consents: {
      personalization: {
        consented: boolean;
      };
    };
    connected_accounts: unknown[];
    auth_session_id_hash: string; // base64
    api_code_version: 1;
    analytics_token: string;
    _trace: string[];
  };
}

export interface WsMsg0Dispatch_2_READY_SUPPLEMENTAL {
  op: 0;
  s: 2;
  t: "READY_SUPPLEMENTAL";
  d: {
    merged_presences: {
      guilds: Array<Array<UserDetail>>;
      friends: unknown[];
    };
    merged_members: UserDetail2[][];
    lazy_private_channels: unknown[];
    guilds: Array<{
      id: Snowflake;
      voice_states: VoiceStates[];
      embedded_activities: unknown[];
    }>;
    disclose: Array<"pomelo" | string>;
  };
}

export interface WsMsg0Dispatch_4_PASSIVE_UPDATE_V1 {
  op: 0;
  s: 4;
  t: "PASSIVE_UPDATE_V1";
  d: {
    voice_states: VoiceStates[];
    members: UserDetail3[];
    guild_id: Snowflake;
    channels: Array<{
      last_pin_timestamp?: string;
      last_message_id: Snowflake;
      id: Snowflake;
    }>;
  };
}
export interface WsMsg0Dispatch_20_SESSIONS_REPLACE {
  op: 0;
  s: 20;
  t: "SESSIONS_REPLACE";
  d: Array<{
    status: "online";
    session_id: string;
    client_info: {
      version: 0;
      os: "windows";
      client: "web";
    };
    activities: unknown[];
  }>;
}

export interface WsMsg0Dispatch_24_INTERACTION_CREATE {
  op: 0;
  s: 24;
  t: "INTERACTION_CREATE";
  d: {
    nonce: Snowflake;
    id: Snowflake;
  };
}

export interface WsMsg0Dispatch_25_INTERACTION_SUCCESS {
  op: 0;
  s: 25;
  t: "INTERACTION_SUCCESS";
  d: {
    nonce: Snowflake;
    id: Snowflake;
  };
}

export interface WsMsg0Dispatch_27_MESSAGE_UPDATE {
  op: 0;
  s: 27;
  t: "MESSAGE_UPDATE";
  d: APIMessage;
}

export interface WsMsg0Dispatch_29_MESSAGE_CREATE {
  op: 0;
  s: 29;
  t: "MESSAGE_CREATE";
  d: APIMessage;
}

export interface WsMsg0Dispatch_30_MESSAGE_DELETE {
  op: 0;
  s: 30;
  t: "MESSAGE_DELETE";
  d: {
    id: Snowflake;
    channel_id: Snowflake;
  };
}
export interface WsMsg0Dispatch_31_MESSAGE_ACK {
  op: 0;
  s: 31;
  t: "MESSAGE_ACK";
  d: {
    version: 1523;
    message_id: Snowflake;
    last_viewed: null;
    flags: null;
    channel_id: Snowflake;
  };
}

export type WsMsg0Dispatch =
  | WsMsg0Dispatch_1_READY
  | WsMsg0Dispatch_2_READY_SUPPLEMENTAL
  | WsMsg0Dispatch_4_PASSIVE_UPDATE_V1
  | WsMsg0Dispatch_20_SESSIONS_REPLACE
  | WsMsg0Dispatch_24_INTERACTION_CREATE
  | WsMsg0Dispatch_25_INTERACTION_SUCCESS
  | WsMsg0Dispatch_27_MESSAGE_UPDATE
  | WsMsg0Dispatch_29_MESSAGE_CREATE
  | WsMsg0Dispatch_30_MESSAGE_DELETE
  | WsMsg0Dispatch_31_MESSAGE_ACK;
