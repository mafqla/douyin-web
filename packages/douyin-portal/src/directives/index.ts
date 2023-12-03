import {lazy} from './lazy'

export default (app: {
    directive: (
        arg0: string,
        arg1: { mounted(el: any, binding: any): void }
    ) => void
}) => {
    app.directive('lazy', lazy)
}
