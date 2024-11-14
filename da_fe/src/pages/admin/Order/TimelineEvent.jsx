import React, { Fragment } from 'react';
import clsx from 'clsx';
import isReact from 'is-react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const Container = styled(Grid)(({ theme }) => ({
    position: 'relative',
    overflowX: 'auto', // Hiển thị thanh cuộn ngang nếu cần
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%', // Đảm bảo chiều rộng của container là 100%
    maxWidth: '100%', // Đảm bảo không vượt quá 100% chiều rộng của phần tử cha
}));

const Icon = styled('div')(({ theme }) => ({
    position: 'relative',
    top: 16,
    left: 92.5,
    fontSize: 14, // Giảm kích thước biểu tượng
    color: '#fff',
}));

const IconSimple = styled(Icon)(({ theme }) => ({
    left: 16,
    fontSize: 16, // Giảm kích thước biểu tượng nhỏ
}));

const IconSmall = styled('div')(({ theme }) => ({
    position: 'relative',
    top: 8,
    left: 8,
    fontSize: 8, // Giảm kích thước biểu tượng nhỏ nhất
    color: '#e0e0e0',
}));

const CircleContainer = styled(Grid)(({ theme }) => ({
    marginRight: 15, // Giảm khoảng cách phải
}));

const CircleContainerSmall = styled(Grid)(({ theme }) => ({
    display: 'flex',
    flex: 'auto',
    alignItems: 'center',
    marginRight: 5, // Giảm khoảng cách phải
}));

const Action = styled(Grid)(({ theme }) => ({
    '&:hover': {
        cursor: 'pointer',
    },
}));

const TooltipStyle = styled(Grid)(({ theme }) => ({
    textAlign: 'center',
}));

const BarSimple = styled('div')(({ theme }) => ({
    position: 'relative',
    top: '50%',
    left: -15, // Điều chỉnh lại vị trí thanh
    width: 8, // Giảm chiều rộng của thanh
    height: 2,
    backgroundColor: '#f2f2f2',
}));

const BarSmall = styled('div')(({ theme }) => ({
    position: 'relative',
    top: '50%',
    left: -5, // Điều chỉnh lại vị trí thanh nhỏ
    width: 3, // Giảm chiều rộng của thanh nhỏ
    height: 2,
    backgroundColor: '#f2f2f2',
}));

const TextContainer = styled(Grid)(({ theme }) => ({
    marginTop: 1, // Đảm bảo có khoảng cách giữa title và icon
    textAlign: 'center',
    marginBottom: 10,
}));

const ActionContainer = styled(Grid)(({ theme }) => ({
    margin: '12px auto', // Giảm margin trên/dưới
}));

const ButtonContainer = styled(Grid)(({ theme }) => ({
    margin: '12px auto', // Giảm margin trên/dưới
    textAlign: 'center',
}));

const ButtonStyle = styled(Button)(({ theme }) => ({
    color: '#fff',
}));

const TimelineEvent = ({
    variant,
    first,
    color = '#e0e0e0',
    icon: IconComponent,
    title,
    subtitle,
    action,
    titleProps,
    subtitleProps,
}) => {
    switch (variant) {
        case 'small':
            return (
                <Container>
                    <Fragment>
                        <Tooltip
                            title={
                                <TooltipStyle>
                                    {title}
                                    <br />
                                    {subtitle}
                                </TooltipStyle>
                            }
                        >
                            <CircleContainerSmall
                                onClick={action && action.onClick}
                                className={clsx({ [Action]: action })}
                            >
                                {IconComponent && <IconSmall component={IconComponent} style={{ color }} />}
                                <svg width={16} height={16} viewBox="0 0 8.467 8.467">
                                    <circle
                                        cx={4.233}
                                        cy={292.767}
                                        r={4.035}
                                        fill="#fff"
                                        stroke={color}
                                        strokeWidth={0.397}
                                        transform="translate(0 -288.533)"
                                    />
                                </svg>
                            </CircleContainerSmall>
                        </Tooltip>
                        {!first && <BarSmall />}
                    </Fragment>
                </Container>
            );
        case 'simple':
            return (
                <Container>
                    <Fragment>
                        <Tooltip
                            title={
                                <TooltipStyle>
                                    {title}
                                    <br />
                                    {subtitle}
                                </TooltipStyle>
                            }
                        >
                            <CircleContainer onClick={action && action.onClick} className={clsx({ [Action]: action })}>
                                {IconComponent && <IconSimple component={IconComponent} />}
                                <svg viewBox="0 0 19.05 19.05" height={30} width={30}>
                                    <g transform="translate(0 -277.95)">
                                        <circle cx={3.525} cy={287.475} r={9.525} fill={color} strokeWidth={0.193} />
                                    </g>
                                </svg>
                            </CircleContainer>
                        </Tooltip>
                        {!first && <BarSimple />}
                    </Fragment>
                </Container>
            );
        default:
            return (
                <Container>
                    <Fragment>
                        {IconComponent && <Icon component={IconComponent} />}
                        <svg width={160} height={130} viewBox="0 0 59.531 49.477">
                            <g transform="matrix(.99959 0 0 .99838 -100.96 -38.57)">
                                <path
                                    d="M101.002 69.656h55.492l4.064 4.158-4.064 4.205h-55.492l3.85-4.205z"
                                    fill={color}
                                    strokeWidth={0.24}
                                />
                                <circle cx={130.726} cy={73.838} r={1.522} fill="#fff" strokeWidth={0.15} />
                                <circle cx={130.78} cy={48.202} r={9.57} fill={color} strokeWidth={0.194} />
                                <rect
                                    width={0.794}
                                    height={14.363}
                                    x={130.383}
                                    y={56.309}
                                    ry={0}
                                    fill={color}
                                    strokeWidth={0.108}
                                />
                            </g>
                        </svg>
                        <TextContainer>
                            {typeof title === 'string' ? (
                                <Typography variant="h6" {...titleProps} style={{ fontSize: '0.875rem' }}>
                                    {title}
                                </Typography>
                            ) : (
                                title
                            )}
                            {typeof subtitle === 'string' ? (
                                <Typography variant="caption" {...subtitleProps} className="text-xs">
                                    {subtitle}
                                </Typography>
                            ) : (
                                subtitle
                            )}
                        </TextContainer>
                        {action && (
                            <ActionContainer>
                                {isReact.compatible(action) ? (
                                    action
                                ) : (
                                    <ButtonContainer>
                                        <ButtonStyle
                                            size="small"
                                            onClick={action.onClick}
                                            style={{ backgroundColor: color }}
                                        >
                                            {action.label}
                                        </ButtonStyle>
                                    </ButtonContainer>
                                )}
                            </ActionContainer>
                        )}
                    </Fragment>
                </Container>
            );
    }
};

export default TimelineEvent;
