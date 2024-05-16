// A generated module for Neuronek functions
//
// This module has been generated via dagger init and serves as a reference to
// basic module structure as you get started with Dagger.
//
// Two functions have been pre-created. You can modify, delete, or add to them,
// as needed. They demonstrate usage of arguments and return types using simple
// echo and grep commands. The functions can be called from the dagger CLI or
// from one of the SDKs.
//
// The first line in this comment block is a short description line and the
// rest is a long description with more detail on the module's purpose or usage,
// if appropriate. All modules should have a short description.

package main

import (
	"context"
	"dagger.io/dagger"
)

type Neuronek struct{}

// Build a monorepository with pnpm
func (m *Neuronek) Build() *Container {
	const pnpmCachePath = "/tmp/cache/pnpm"
	const turboCachePath = "/tmp/cache/turbo"

	pnpmCache := dag.CacheVolume(pnpmCachePath)

	project := dag.Git("https://github.com/keinsell/neuronek").Branch("trunk").Tree()

	return dag.Node().
		WithPnpm(NodeWithPnpmOpts{
			Cache: pnpmCache,
		}).
		Install([]string{"turbo", "pnpm@8.6.0"}).
		WithSource(project).
		Container().
		// Configure Node Environment
		WithEnvVariable("COREPACK_ENABLE", "true").
		WithEnvVariable("PNPM_HOME", pnpmCachePath).
		WithEnvVariable("PATH", "$PNPM_HOME:$PATH").
		WithDefaultTerminalCmd([]string{"corepack", "enable"}).
		WithMountedCache(pnpmCachePath, pnpmCache).
		// Copy manifest files and install them
		WithDirectory("/runtime", project).
		WithWorkdir("/runtime").
		WithDefaultTerminalCmd([]string{"pnpm", "install", "--frozen-lockfile"}).
		// Mount directory
		//WithDirectory("/runtime", project).
		//WithWorkdir("/runtime").
		WithExec([]string{"turbo", "build"})
}

func (m *Neuronek) Version() Void {
	ctx := context.Background()

	client, err := dagger.Connect(ctx)

	if err != nil {
		panic(err)
	}

	defer client.Close()

	node := client.Container().From("node:latest").WithExec([]string{"node", "-v"})
	_, err = node.Stdout(ctx)

	if err != nil {
		panic(err)
	}

	return Void(1)
}
