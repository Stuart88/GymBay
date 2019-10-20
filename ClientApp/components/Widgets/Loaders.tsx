import * as React from 'react';

interface InlineLoaderProps {
    Text: string
    Loading: boolean
}


export class InlineLoader extends React.Component<InlineLoaderProps, {}> {

    constructor(props) {
        super(props);
        
    }


    public render() {

        return this.props.Loading
            ? <span>{this.props.Text} <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"> </span>

            </span>
            : <span>{this.props.Text}</span>
        
    }
}

interface LoaderProps {
    CentreAlign: boolean,
    ContainerMargin: string,
    Height: string
}

export class Loader extends React.Component<LoaderProps, {}> {

    constructor(props) {
        super(props);

    }


    public render() {

        return <div style={{ margin: this.props.ContainerMargin }}>
            <img style={{
                margin: this.props.CentreAlign ? 'auto' : '0',
                height: this.props.Height,
                display: this.props.CentreAlign ? 'block' : 'initial'
            }}
                className="img-fluid"
                src="/dist/general/loading.svg" />
        </div>

    }
}
