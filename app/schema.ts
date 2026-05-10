import {co, Group, z} from 'jazz-tools';
import {faker} from '@faker-js/faker/locale/en';


export const JazzProfile = co.profile({
  username: z.string(),
  name: z.string(),
});

export const ChatMessage = co.plainText();

export const JazzReactions = co.list(z.string());

export const JazzMessage = co.map({
  text: ChatMessage,
  reactions: co.optional(JazzReactions),
}).withPermissions({
  default: () => Group.create().makePublic('writer'),
})

export const JazzChat = co.map({
  messages: co.list(JazzMessage),
}).withPermissions({
  default: () => Group.create().makePublic('writer'),
});

export type JazzChat = co.loaded<typeof JazzChat>;

export const Root = co.map({
  chats: co.list(JazzChat),
});

export const JazzAccount = co.account({
  root: Root,
  profile: JazzProfile
}).withMigration(async (account) => {
  if (!account.$jazz.has("root")) {
    account.$jazz.set("root", {
      chats: []
    });
  }


  if (!account.$jazz.has("profile")) {
    const profileGroup = Group.create();
    profileGroup.makePublic();
    account.$jazz.set("profile", JazzProfile.create({
      name: faker.person.firstName(),
      username: faker.internet.username().toLowerCase(),
    }, profileGroup));
  }
});