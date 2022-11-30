import Id from '../../_structures/schemas/IdsSchema';

export const getIdConfig = async (guildId: string) => {
    const idConfig = await Id.findOne(
        {
            guildId,
        },
        (err: any, id: any) => {
            if (err) console.log(err);
            if (!id)
                new Id({
                    guildId,
                    suggestId: 0,
                }).save();
        }
    )
        .clone()
        .catch(() => {});
    return idConfig;
};
