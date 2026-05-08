import { co, Group, z, setDefaultValidationMode } from "jazz-tools";

setDefaultValidationMode("strict");

export const MessageProfile = co
    .profile({
      name: z.string(),
      messages: co.list(co.plainText()),
    })
    .resolved({
      messages: { $each: true },
    });

export const JazzAccount = co
    .account({
      profile: MessageProfile,
      root: co.map({}),
    })
    .withMigration(async (account) => {
      if (!account.$jazz.has("profile")) {
        account.$jazz.set(
            "profile",
            MessageProfile.create(
                {
                  name: "Anonymous",
                  messages: [],
                },
                Group.create().makePublic(),
            ),
        );
      }

      const { profile } = await account.$jazz.ensureLoaded({
        resolve: {
          profile: true,
        },
      });

      if (!profile.$jazz.has("messages")) {
        profile.$jazz.set("messages", []);
      }
    });

export const JazzAccountWithMessages = JazzAccount.resolved({
  profile: MessageProfile.resolveQuery,
});

export type JazzAccountWithMessages = co.loaded<typeof JazzAccountWithMessages>;