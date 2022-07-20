export class UserRelationsUpdatedCommand {
    constructor(
        public readonly uuid: string,
    ) {
        console.log(`new UserRelationsUpdatedCommand() uuid: ${uuid}`)
    }
}