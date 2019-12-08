import Note from '../../../../models/note';
import { IRemoteUser } from '../../../../models/user';
import deleteNode from '../../../../services/note/delete';
import { apLogger } from '../../logger';

const logger = apLogger;

export default async function(actor: IRemoteUser, uri: string): Promise<void> {
	logger.info(`Deleting the Note: ${uri}`);

	const note = await Note.findOne({ uri });

	if (note == null) {
		logger.warn(`note not found:  ${uri}`);
		return;
	}

	if (!note.userId.equals(actor._id)) {
		logger.warn(`投稿を削除しようとしているユーザーは投稿の作成者ではありません:  ${uri}`);
		return;
	}

	await deleteNode(actor, note);
}
