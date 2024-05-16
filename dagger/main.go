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
	return dag.Node().WithPnpm().Container()
	//   const node = client.container().from("node:16-slim").withExec(["node", "-v"])
	//
	//  const version = await node.stdout()
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
