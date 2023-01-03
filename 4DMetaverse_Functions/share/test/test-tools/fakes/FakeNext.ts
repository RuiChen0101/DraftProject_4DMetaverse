export var callNext: boolean = false;
export const clear = () => {
    callNext = false;
}
export default () => {
    callNext = true;
}