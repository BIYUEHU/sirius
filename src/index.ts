import { META } from './constants';

ll.registerPlugin(META.name, META.description, META.version, {
  author: META.author,
  license: META.license,
  repository: META.repository
});

logger.info(`Sirius Loaded v${META.version.join('.')}`);
