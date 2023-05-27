export function addProps (propNames: string[], propValues: any[], propObject: Record< string, any >): void {
  for (let i = 0; i < propNames.length; i++) {
    if(propValues[i]) propObject[propNames[i]] = propValues[i];
  }
}