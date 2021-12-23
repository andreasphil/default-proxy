import { assertEquals } from "https://deno.land/std@0.118.0/testing/asserts.ts";
import defaultProxy from "./index.ts";

type TestType = {
  propertyA: string;
  propertyB: number;
  propertyC?: string;
  propertyD?: boolean;
};

const fixture = defaultProxy<TestType>({
  propertyA: "A",
  propertyB: 1,
  propertyC: "C",
  propertyD: true,
});

Deno.test("initially returns the defaults as the value", () => {
  assertEquals(fixture.value, {
    propertyA: "A",
    propertyB: 1,
    propertyC: "C",
    propertyD: true,
  });
});

Deno.test('resets the value to the defaults', () => {
  fixture.assign("propertyA", "test");
  fixture.assign("propertyB", 42);
  fixture.assign("propertyD", false);
  assertEquals(fixture.value, {
    propertyA: "test",
    propertyB: 42,
    propertyC: "C",
    propertyD: false,
  });

  fixture.reset();
  assertEquals(fixture.value, {
    propertyA: "A",
    propertyB: 1,
    propertyC: "C",
    propertyD: true,
  });
})

Deno.test("initially returns a default for a required property", () => {
  fixture.reset();
  assertEquals(fixture.value.propertyA, "A");
});

Deno.test("initially returns a default for an optional property", () => {
  fixture.reset();
  assertEquals(fixture.value.propertyD, true);
});

Deno.test("returns the updated object after setting a new value", () => {
  fixture.reset();
  fixture.assign("propertyA", "test");
  fixture.assign("propertyB", 42);
  fixture.assign("propertyD", false);

  assertEquals(fixture.value, {
    propertyA: "test",
    propertyB: 42,
    propertyC: "C",
    propertyD: false,
  });
});

Deno.test("returns an updated property after setting it to a truthy value", () => {
  fixture.reset();
  fixture.assign("propertyC", "test");
  assertEquals(fixture.value.propertyC, "test");
});

Deno.test("returns the default value in the object after setting a value to undefined", () => {
  fixture.reset();
  fixture.assign("propertyA", "test");
  fixture.assign("propertyB", 42);
  fixture.assign("propertyD", false);

  fixture.assign("propertyA", undefined);
  fixture.assign("propertyD", undefined);

  assertEquals(fixture.value, {
    propertyA: "A",
    propertyB: 42,
    propertyC: "C",
    propertyD: true,
  });
});

Deno.test("returns the default value for an individual property after setting a value to undefined", () => {
  fixture.reset();
  fixture.assign("propertyA", "test");
  fixture.assign("propertyA", undefined);

  assertEquals(fixture.value.propertyA, "A");
});
