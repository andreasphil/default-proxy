# Default Proxy

Creates a wrapper proxy around an object. For each property of the object, you
need to provide a default value (you can assign new values later on). The proxy
will return the new value if one exists, or the default value otherwise. This
lets you create an instance of a type where every property is guaranteed to have
a value.

This is is useful, for example, when you're implementing a [Template-like pattern](https://en.wikipedia.org/wiki/Template_method_pattern) where consumers are allowed to replace different steps with their own methods, but you want to make sure you have a fallback if they don't.

> ⚠️ This is an exercise, don't use!

## Usage

```ts
import defaultProxy from "default-proxy";

export type ExampleType = {
  propertyA: string;
  propertyB: string;
};

const { assign, reset, value } = defaultProxy<ExampleType>({
  propertyA: "Value A",
  propertyB: "Value B",
});

// Initially, all properties will return their default values
console.log(value.propertyA); // -> "Value A"

// Setting a property value will cause the new value to be returned
// next time
assign("propertyA", "New value A");
console.log(value.propertyA); // -> "New value A"

// Setting the value to undefined will cause the default we
// assigned initially to be returned next time
assign("propertyA", undefined);
console.log(value.propertyA); // -> "Value A"
```

## Commands

```sh
# Run tests
deno test

# Bundle for browser use
deno build --config deno.json index.ts dist/index.json
```

## Limitations

This is an exercise with proxies and Deno that doesn't handle every possible use
case. Limitations include:

- Behavior gets lost after destructuring, which turns the proxy into an ordinary
  object without any fallback handling
- Access control to properties is mostly enforced via TypeScript, so you can easily provoke unexpected behavior by casting to any or not using TypeScript
- I'm generally not sure if this is a great way of solving the problem of fallback values because it's less readable than `obj.prop ?? fallback`
