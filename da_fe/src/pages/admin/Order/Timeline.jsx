import React, { Children, cloneElement, Component, Fragment } from 'react';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import { styled } from '@mui/material/styles';
import { Placeholder, PlaceholderSimple, PlaceholderSmall } from './Placeholder';

const Wrapper = styled(Grid)(({ theme }) => ({
    position: 'relative',
    overflow: 'auto',
}));

const Container = styled(Grid)(({ theme }) => ({
    display: 'inline-flex',
    flex: '1 1 auto',
}));

const Middle = styled(Grid)(({ theme }) => ({
    marginLeft: -10,
}));

const renderPlaceholders = (props) => {
    const { difference: quantity, variant = 'default', childrenWithProps } = props;

    if (quantity) {
        const placeholders = [];
        let index = 0;

        while (index < quantity) {
            switch (variant) {
                case 'small':
                    placeholders.push(
                        <PlaceholderSmall key={index} first={index === 0} quantity={childrenWithProps.length} />,
                    );
                    break;
                case 'simple':
                    placeholders.push(
                        <PlaceholderSimple key={index} first={index === 0} quantity={childrenWithProps.length} />,
                    );
                    break;
                default:
                    placeholders.push(
                        <Grid key={index}>
                            <Placeholder />
                        </Grid>,
                    );
                    break;
            }

            index++;
        }

        return placeholders;
    }
};

class Timeline extends Component {
    componentDidMount() {
        const scrollbar = this.scrollbar;
        scrollbar.scrollLeft = scrollbar.offsetWidth;
    }

    render() {
        const {
            children,
            variant = 'default',
            height = variant === 'small' ? 95 : variant === 'simple' ? 135 : 265,
            minEvents = 0,
            maxEvents = 0,
            placeholder,
            PerfectScrollbarProps,
        } = this.props;
        const difference = children ? minEvents - children.length : minEvents;
        const childrenWithProps = children
            ? Children.map(children, (child, index) =>
                  cloneElement(child, {
                      variant,
                      placeholder,
                      first: index === 0,
                  }),
              )
            : [];
        const placeholders = renderPlaceholders({
            difference,
            variant,
            childrenWithProps,
        });

        return (
            <Wrapper container style={{ height }}>
                <PerfectScrollbar containerRef={(element) => (this.scrollbar = element)} {...PerfectScrollbarProps}>
                    <CssBaseline />
                    <Container>
                        {maxEvents ? (
                            <Fragment>
                                {childrenWithProps.map((child, index) => (
                                    <Fragment key={index}>
                                        {index < maxEvents && (
                                            <Middle
                                                className={clsx({
                                                    // MUI v5 no longer supports classnames on styled components
                                                    // Adjust this part as necessary based on your requirements
                                                    [variant === 'default' &&
                                                    index > 0 &&
                                                    index < children.length]: true,
                                                })}
                                            >
                                                {child}
                                            </Middle>
                                        )}
                                    </Fragment>
                                ))}
                            </Fragment>
                        ) : (
                            <Fragment>
                                {childrenWithProps.map((child, index) => (
                                    <Middle
                                        key={index}
                                        className={clsx({
                                            [variant === 'default' && index > 0 && index < children.length]: true,
                                        })}
                                    >
                                        {child}
                                    </Middle>
                                ))}
                            </Fragment>
                        )}
                        {minEvents > 0 && difference > 0 && placeholder && placeholders}
                    </Container>
                </PerfectScrollbar>
            </Wrapper>
        );
    }
}

export default Timeline;
