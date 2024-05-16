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
)

type Neuronek struct{}

// Returns a container that echoes whatever string argument is provided
func (m *Neuronek) ContainerEcho(stringArg string) *Container {
	return dag.Container().From("alpine:latest").WithExec([]string{"echo", stringArg})
}

// Returns lines that match a pattern in the files of the provided Directory
func (m *Neuronek) GrepDir(ctx context.Context, directoryArg *Directory, pattern string) (string, error) {
	return dag.Container().
		From("alpine:latest").
		WithMountedDirectory("/mnt", directoryArg).
		WithWorkdir("/mnt").
		WithExec([]string{"grep", "-R", pattern, "."}).
		Stdout(ctx)
}

func (m *Neuronek) Build(source *Directory) *Container {
	node := dag.Node()
	node = m.setupPnpm(node)
	return node.Container()
}

func (m *Neuronek) buildBaseImage(source *Directory) *Container {
	return dag.Node().WithPackageManager("pnpm").Container()
}

func (m *Neuronek) setupPnpm(node *Node) *Node {
	return node.WithPackageManager("pnpm")
}
