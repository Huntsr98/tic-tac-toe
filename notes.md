# Notes

## TypeScript Stuff

### Generics!

```typescript
type MyObj <MyValue, MyValueTwo>= {
    propOne: true
    proTwo: MyValue | MyValueTwo

}

type MyCompleteObj = MyObj<false, 2>

```