import { readJson, readProjectConfiguration } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { applicationGenerator } from './generator';
import { ApplicationGeneratorSchema } from './schema';
import { UnitTestRunner, E2eTestRunner } from '@nx/angular/generators';
import { GeneratorTemplate } from './lib/templates.type';

describe('application schematic', () => {
  const setup = async () => {
    const host = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    host.write('.gitignore', '');
    const schema: ApplicationGeneratorSchema = {
      name: 'my-app',
      template: GeneratorTemplate.Blank,
      unitTestRunner: UnitTestRunner.None,
      e2eTestRunner: E2eTestRunner.None,
      capacitor: false,
      skipFormat: false,
    };
    const projectRoot = `apps/${schema.name}`;
    return {
      host,
      schema,
      projectRoot,
    };
  };

  it('should add dependencies to package.json', async () => {
    const { host, schema } = await setup();
    await applicationGenerator(host, schema);

    const packageJson = readJson(host, 'package.json');
    expect(packageJson.dependencies['@ionic/angular']).toBeDefined();
    expect(packageJson.devDependencies['@nx/angular']).toBeDefined();
  });

  it('should update assets in project configuration', async () => {
    const { host, schema, projectRoot } = await setup();

    await applicationGenerator(host, schema);
    const project = readProjectConfiguration(host, schema.name);

    const assets = project.targets.build.options.assets;
    const styles = project.targets.build.options.styles;

    expect(assets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          input: 'node_modules/ionicons/dist/ionicons/svg',
        }),
      ])
    );
    expect(assets).not.toContain(`${projectRoot}/src/favicon.ico`);

    expect(styles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          input: `${projectRoot}/src/theme/variables.scss`,
        }),
      ])
    );
  });

  describe('--linter', () => {
    it('should update .eslintrc.json', async () => {
      const { host, schema } = await setup();
      await applicationGenerator(host, schema);

      const eslintrcJson = readJson(host, `apps/${schema.name}/.eslintrc.json`);
      const tsOverride = eslintrcJson.overrides.find(
        (override: { files: string | string[] }) =>
          override.files.includes('*.ts')
      );

      expect(
        tsOverride.rules['@angular-eslint/component-class-suffix']
      ).toEqual([
        'error',
        {
          suffixes: ['Page', 'Component'],
        },
      ]);
      expect(
        tsOverride.rules['@angular-eslint/no-empty-lifecycle-method']
      ).toEqual(0);
      expect(tsOverride.rules['@typescript-eslint/no-empty-function']).toEqual(
        0
      );
    });
  });

  describe('--template', () => {
    it('should add base template files', async () => {
      const { host, schema, projectRoot } = await setup();
      await applicationGenerator(host, schema);

      expect(host.exists(`${projectRoot}/ionic.config.json`)).toBeTruthy();

      expect(host.exists(`${projectRoot}/src/favicon.ico`)).toBeFalsy();
      expect(host.exists(`${projectRoot}/src/assets/shapes.svg`)).toBeTruthy();
      expect(
        host.exists(`${projectRoot}/src/assets/icon/favicon.png`)
      ).toBeTruthy();

      expect(
        host.exists(`${projectRoot}/src/theme/variables.scss`)
      ).toBeTruthy();

      expect(host.exists(`${projectRoot}/src/app/app.module.ts`)).toBeTruthy();
    });

    it('--blank', async () => {
      const { host, schema, projectRoot } = await setup();
      await applicationGenerator(host, { ...schema, template: 'blank' });

      expect(
        host.exists(`${projectRoot}/src/app/home/home.module.ts`)
      ).toBeTruthy();
    });

    it('--list', async () => {
      const { host, schema, projectRoot } = await setup();
      await applicationGenerator(host, { ...schema, template: 'list' });

      expect(
        host.exists(
          `${projectRoot}/src/app/view-message/view-message.module.ts`
        )
      ).toBeTruthy();
    });

    it('--sidemenu', async () => {
      const { host, schema, projectRoot } = await setup();
      await applicationGenerator(host, { ...schema, template: 'sidemenu' });

      expect(
        host.exists(`${projectRoot}/src/app/folder/folder.module.ts`)
      ).toBeTruthy();
    });

    it('--tabs', async () => {
      const { host, schema, projectRoot } = await setup();
      await applicationGenerator(host, { ...schema, template: 'tabs' });

      expect(
        host.exists(`${projectRoot}/src/app/tabs/tabs.module.ts`)
      ).toBeTruthy();
    });
  });

  describe('--directory', () => {
    it('should update workspace.json', async () => {
      const { host, schema, projectRoot } = await setup();
      await applicationGenerator(host, { ...schema, directory: 'myDir' });
      const project = readProjectConfiguration(host, `my-dir-${schema.name}`);
      const projectE2e = readProjectConfiguration(
        host,
        `my-dir-${schema.name}-e2e`
      );

      expect(project.root).toEqual('apps/my-dir/my-app');
      expect(projectE2e.root).toEqual('apps/my-dir/my-app-e2e');
    });

    it('should generate files', async () => {
      const { host, schema, projectRoot } = await setup();
      await applicationGenerator(host, { ...schema, directory: 'myDir' });

      expect(host.exists('apps/my-dir/my-app/src/main.ts'));
    });

    it('should generate Capacitor project', async () => {
      const { host, schema, projectRoot } = await setup();
      await applicationGenerator(host, {
        ...schema,
        directory: 'my-dir',
        capacitor: true,
      });

      expect(
        host.exists(`apps/my-dir/my-app/capacitor.config.ts`)
      ).toBeDefined();
    });
  });

  describe('--unitTestRunner', () => {
    it('none', async () => {
      const { host, schema, projectRoot } = await setup();
      await applicationGenerator(host, {
        ...schema,
        unitTestRunner: 'none',
      });

      expect(host.read(`package.json`).includes('jest')).toBeFalsy();
      expect(
        host.exists(`${projectRoot}/src/app/home/home.page.spec.ts`)
      ).toBeFalsy();
    });

    it('jest', async () => {
      const { host, schema, projectRoot } = await setup();
      await applicationGenerator(host, {
        ...schema,
        unitTestRunner: 'jest',
      });

      expect(host.read(`package.json`).includes('jest')).toBeTruthy();
    });
  });

  describe('--tags', () => {
    it('should update nx.json', async () => {
      const { host, schema, projectRoot } = await setup();
      await applicationGenerator(host, { ...schema, tags: 'one,two' });

      const projectConfiguration = readProjectConfiguration(host, schema.name);
      expect(projectConfiguration.tags).toEqual(['one', 'two']);
    });
  });

  describe('--capacitor', () => {
    describe('true', () => {
      it('should generate Capacitor project', async () => {
        const { host, schema, projectRoot } = await setup();
        await applicationGenerator(host, { ...schema, capacitor: true });

        expect(host.exists(`${projectRoot}/capacitor.config.ts`)).toBeDefined();
      });
    });
  });
});
