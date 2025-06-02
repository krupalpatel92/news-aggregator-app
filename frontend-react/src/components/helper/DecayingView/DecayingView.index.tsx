import { Component } from 'react';
import { IDecayingViewProps } from './DecayingView.types';

/**
 * A component that decays to nothing when it
 * has the `isVisible` prop set to `false`, or
 * there are no non-decayed children.
 */
export default class DecayingView extends Component<IDecayingViewProps> {
	public render() {
		if (!this.props.isVisible || this.props.children === undefined) {
			return null;
		}

		return this.props.children;
	}
}
