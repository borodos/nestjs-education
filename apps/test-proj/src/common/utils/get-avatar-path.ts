import buckets from '../../providers/files/s3/constants/buckets';
import folders from '../../providers/files/s3/constants/folders';

export default function getAvatarPath(storageUrl: string, fileName: string) {
  return `${storageUrl}${buckets.MY_BUCKET}/${folders.avatars}/${fileName}`;
}
