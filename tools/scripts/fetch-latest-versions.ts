import { spawnSync } from 'child_process';
import { capacitorVersion } from '../../packages/capacitor/src/utils/versions';

console.log('======================================');
console.log('Capacitor:');
console.log('======================================');

const capacitorPkgs = [
  { pkg: '@capacitor/core', version: capacitorVersion },
  { pkg: '@capacitor/android', version: capacitorVersion },
  { pkg: '@capacitor/ios', version: capacitorVersion },
  { pkg: '@capacitor/cli', version: capacitorVersion },
];

capacitorPkgs.forEach(({ pkg, version }) => {
  checkVersion(pkg, version);
});

function checkVersion(pkg: string, version: string = '') {
  const show = spawnSync(`npm`, ['show', pkg, 'version']);
  const currentVersion = show.stdout
    .toString()
    .replace('^', '')
    .replace('~', '')
    .trim();
  version = version.replace('^', '').replace('~', '').trim();
  if (version !== currentVersion) {
    console.log(`${pkg}: ${version} -> ${currentVersion}`);
  }
}
