import React, { useEffect, useState, useContext } from 'react';
import {createNewTask} from '../store/tasks'
import Switch from '@material-ui/core/Switch';
import { useDispatch, useSelector } from 'react-redux';
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import InputLabel from '@material-ui/core/InputLabel';
import CloseIcon from '@material-ui/icons/Close';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { updateExistingTask, loadUserTasks} from '../store/tasks'
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import Calendar from './CalendarPage'
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { green, purple } from '@material-ui/core/colors';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import { createMuiTheme, withStyles, ThemeProvider } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import NewTaskForm from './newTaskForm'
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MenuItem from '@material-ui/core/MenuItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import Select from '@material-ui/core/Select';
import './TaskTable.css'
import {markAsNew,markComplete} from '../store/tasks'
import { CircularProgress } from '@material-ui/core';
import Input from '@material-ui/core/Input';
import Chip from '@material-ui/core/Chip';
import TaskList from './CurrentTaskList'
import TaskListContext from './TaskListContext'
import SelectedTaskCard from './SelectedTaskCard'
import { SnackbarProvider, useSnackbar } from 'notistack';
import UserTeamsContext from './UserTeamsContext';
import Unicorn from "../images/159960637489457530 (1).png"
import parrot from "../images/pngegg.png"
const crazy = "./Yeti-riding-unicorn-320-1--unscreen.gif"
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const names = [
    'All Tasks',
    'Incomplete Tasks',
    'Completed Tasks',
    'Unassigned Tasks',
    'Outgoing Tasks',
    'Incoming Tasks',
];

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    rootTab: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    rootOne: {
        width: '100%',
        maxWidth: "560px",
        backgroundColor: theme.palette.background.paper,
        position: "relative",
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    formControlSelect: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 300,
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    },
    newTaskForm: {
        width: '100%',
        maxWidth: "480px",
        opacity: "100%",
        height: "470px",
        margin: "10px",
        right: "30px",
        backgroundColor: theme.palette.background.paper,
        position: "sticky",
        bottom: "0px",
        boxShadow: "0px 0px 5px 7px rgba(0,0,0,0.05)",
        zIndex:1
    },
    taskDetailPaperRoot: {
        height: 180,
    },
    margin: {
        margin: theme.spacing(1),
    },
    completeButton: {
        color: "grey",
        '&:hover': {
            color: "#25e8c8",
        }
    },
    DeCompleteButton: {
        color: "#25e8c8",
        '&:hover': {
            color: "grey",
        }
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    wrapper: {
        width: 100 + theme.spacing(2),
    },
    taskDetailPaper: {
        zIndex: 1,
        position: 'sticky',
        margin: theme.spacing(1),
        top: "350px"
    },
    svg: {
        width: 100,
        height: 100,
    },
    polygon: {
        fill: theme.palette.common.white,
        stroke: theme.palette.divider,
        strokeWidth: 1,
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        outline: "none",
        padding: theme.spacing(2, 4, 3),
        boxSizing: "auto"
    },
    newTaskPaper: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(1, 3, 1),
        outline: "none",
        boxSizing: "auto",
        minWidth: "400px"
    }
}));

const ColorButton = withStyles((theme) => ({
    root: {
        color: theme.palette.getContrastText(purple[500]),
        backgroundColor:"#2196f3 !important",
        '&:hover': {
        backgroundColor: "#14aaf5",
        },
    },
}))(Button);
const ColorTaskButton = withStyles((theme) => ({
    root: {
        color: theme.palette.getContrastText(purple[500]),
        backgroundColor: "#14aaf5",
        '&:hover': {
            backgroundColor: "#FFA500",
        },
    },
}))(Button);

function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

const ColorCompleteButton = withStyles((theme) => ({
    root: {
        color: theme.palette.getContrastText(purple[500]),
        backgroundColor: "grey",
        '&:hover': {
        backgroundColor: "#4158D0",
        backgroundImage:"linearGradient(43deg, #4158D00%, #C850C0 46%, #FFCC70 100%)"
        },
    },
}))(Button);

const ColorCompletedButton = withStyles((theme) => ({
    root: {
        color: theme.palette.getContrastText(purple[500]),
        backgroundColor: "#25e8c8",
        '&:hover': {
            backgroundColor: "#FFA500",
        },
    },
}))(Button);

export default function SelectedListItem(props) {
    const [flyOverObject,setFlyOverObject] = useState(Unicorn)
    const teamContext = useContext(UserTeamsContext)
    const classes = useStyles();
    const dispatch = useDispatch();
    const authorId = useSelector(state => state.auth.id)
    const bull = <span className={classes.bullet}>•</span>;
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const newTasks = useSelector(state => state.userTasks.newTasks)
    const [editField,setEditField] = useState("")
    const [checked, setChecked] = React.useState(false);
    const [newTask, setNewTask] = React.useState(false);
    const [newTaskName, setNewTaskName] = useState('')
    const [newTaskDescription, setNewTaskDescription] = useState('')
    const [newTaskAssigneeId, setNewTaskAssigneeId] = useState(null)
    const [newTaskPriority, setNewTaskPriority] = useState("")
    const [newTaskDueDate, setNewTaskDueDate] = useState(new Date())
    const [taskDetails,setTaskDetails] = useState({})
    const [value, setValue] = React.useState(0);
    const [userListEvents, setUserListEvents] = useState([]);
    const [loading,setLoading]= useState(false)
    const theme = useTheme();
    const [imageArray,setImageArray]= useState([Unicorn, crazy])
    const [animation,setAnimation] = useState("hidden")
    const [personName, setPersonName] = React.useState(['All Tasks']);
    const handleChangeChip = (event) => {
        setPersonName(event.target.value);
        console.log(personName)
        
    };

    const handleChangeMultiple = (event) => {
        const { options } = event.target;
        const value = [];
        for (let i = 0, l = options.length; i < l; i += 1) {
            if (options[i].selected) {
                value.push(options[i].value);
            }
        }
        setPersonName(value);
    };
    let newTaskDetails = useSelector(state=>state.userTasks.newTasks)
    let completedTaskDetails = useSelector(state=>state.userTasks.completedTasks)
    
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // useEffect(()=>{
    //     setTaskDetails(newTaskDetails)
    // },[newTaskDetails])


    useEffect(()=>{
        if (personName.includes('All Tasks')) {
            setTaskDetails({ ...newTaskDetails, ...completedTaskDetails })
        } else if (personName.includes('Incomplete Tasks') && personName.includes('Completed Tasks')) {
            setTaskDetails({ ...newTaskDetails, ...completedTaskDetails })
        } else if (personName.includes('Incomplete Tasks')) {
            setTaskDetails({ ...newTaskDetails })
        } else if (personName.includes('Completed Tasks')) {
            setTaskDetails({ ...completedTaskDetails })
        } else if (!personName.length){
            setTaskDetails({ ...newTaskDetails, ...completedTaskDetails })
        }
    },[newTaskDetails,completedTaskDetails,personName])

    const handleNewTaskNameUpdate = (e) => {
        setNewTaskName(e.target.value)
    }

    const handleNewTaskDescriptionUpdate = (e) => {
        setNewTaskDescription(e.target.value)
    }

    const handleNewTaskAssigneeIdUpdate = (e) => {
        setNewTaskAssigneeId(e.target.value)
    }

    const handleNewTaskPriorityUpdate = (e) => {
        setNewTaskPriority(e.target.value)
    }

    const handleNewTaskDueDateUpdate = (date) => {
        setNewTaskDueDate(date)
    }

    const markTaskNew = () => {
        dispatch(updateExistingTask(Object.values(taskDetails)[selectedIndex].id,{status:"new"}))
    }

    const handleNewTaskSubmit = async (e) => {
        e.preventDefault()
        const newTask = {
            name: newTaskName,
            description: newTaskDescription,
            authorId,
            assigneeId: newTaskAssigneeId,
            status: "new",
            priority: newTaskPriority,
            dueDate: newTaskDueDate
        }
        dispatch(createNewTask(newTask))
        setNewTask(false)
        setNewTaskName('')
        setNewTaskDescription('')
        setNewTaskAssigneeId(null)
        setNewTaskDueDate(new Date())
        setNewTaskPriority(null)
    }

    const handleNewTask = () =>{
        setNewTask(true)
    }
    const closeNewTaskEditor = () => {
        setNewTask(false)
    }
    const handleCloseDetail = () => {
        setChecked(false)
    };

    const EditFormInput = () => {
        return(
            <input type="text" key={`name-input-box-${selectedIndex}`} onChange={(e) => handleTextInput(e, selectedIndex)} style={{ outline: "none", fontSize: "24px", fontWeight: "550", marginBottom: "5px" }} defaultValue={Object.values(taskDetails)[selectedIndex] ? Object.values(taskDetails)[selectedIndex].name : ""} />
        )
    }

    const handleMouseUpDeComplete = (e,index) =>{
        markTaskNew()
    }

    const handleAnimationEnd = () => {
        setAnimation("hidden")
        const newImageArray = [...imageArray]
        const dog = newImageArray.pop()
        newImageArray.unshift(dog)
        setImageArray(newImageArray)
    }

    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
        setSelectedIndex(index)
        setEditField()
        setChecked(true)
        console.log("selectedIndex after set: ", selectedIndex)
    };

    const EditFormInputSmall = ({index}) => {
        return(
            <input type="text" key={index} style={{ fontSize: "14px", width: "200px" }} className={"no-outline"} onChange={(e) => handleTextInput(e, index)} defaultValue={Object.values(taskDetails)[index].name}></input>
        )
    }

    const handleTextInput=async (e,index)=>{
        dispatch(updateExistingTask(Object.values(taskDetails)[index].id,{name:e.target.value}))
        return
    }

    return (
        <TaskListContext.Provider value={{flyOverObject,setAnimation,setNewTask,taskDetails,setTaskDetails,setSelectedIndex,selectedIndex,handleCloseDetail,setChecked}}>
        <div className={classes.root}>
            <div style={{ backgroundColor: "f6f8f9" }}>
            <Tabs value={value} style={{ height: "8px", backgroundColor:"f6f8f9"}}onChange={handleChange} aria-label="simple tabs example">
                <Tab style={{outline:"none"}} label="List" {...a11yProps(0)} />
                <Tab style={{ outline:"none" }} label="Calendar" {...a11yProps(1)} />
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            <FormControl className={classes.formControlSelect}>
                                <Select
                                    labelId="demo-mutiple-chip-label"
                                    id="demo-mutiple-chip"
                                    multiple
                                    variant="standard"
                                    value={personName}
                                    onChange={handleChangeChip}
                                    input={<Input id="select-multiple-chip" />}
                                    renderValue={(selected) => (
                                        <div className={classes.chips}>
                                            {selected.map((value) => (
                                                <Chip key={value} label={value} size="small" className={classes.chip} />
                                            ))}
                                        </div>
                                    )}
                                    MenuProps={MenuProps}
                                >
                                    {names.map((name) => (
                                        <MenuItem key={name} value={name} style={getStyles(name, personName, theme)}>
                                            {name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
            </Tabs>
                <Divider />
                <Paper>
                </Paper>
            </div>
            <TabPanel value={value} index={0} style={{ backgroundColor: "#f6f8f9"}}>
                    <div onAnimationEnd={handleAnimationEnd} className={`box ${animation}`} style={{ maxWidth: "200px", maxHeight: "200px" }}><img src={imageArray[0]} style={{ maxWidth: "500px", maxHeight: "500px" }}/></div>
                <div id="main-content-list-view">
                    <div id="current-tasks-table">
                        <Paper>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                                    <ColorButton variant="contained" onClick={handleNewTask} color="primary" startIcon={<LibraryAddIcon />} style={{margin:"5px"}} className={"animate__animated" +" "+"animate__bounce"}>
                                Add Task
                            </ColorButton>
                        </div>
                        <TaskList/>
                        </Paper>
                    </div>
                    <Slide direction="up" in={checked} mountOnEnter unmountOnExit>
                        <Card className={classes.rootOne}>
                            <SelectedTaskCard />
                        </Card>
                    </Slide>
                    </div>
      </TabPanel>
            <TabPanel value={value} index={1}>
                <Calendar/>
      </TabPanel>
            <TabPanel value={value} index={2}>
                Item Three
      </TabPanel>
        <Slide direction="up" in={newTask} mountOnEnter unmountOnExit>
                <Card className={classes.newTaskForm}>
                    <CardContent>
                        <form id="new-task-form" onSubmit={handleNewTaskSubmit}>
                            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                            <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                <CheckCircleOutlineIcon style={{ color: "lightcoral", marginRight: "4px" }} />
                                <input name="name" type="text" style={{ outline: "none", fontSize: "24px", fontWeight: "550", marginBottom: "5px" }} placeholder={"Task Name"} form="new-form-id" onChange={handleNewTaskNameUpdate} label="Task Name" />
                            </div>
                                <IconButton onClick={closeNewTaskEditor}>
                                    <CloseIcon />
                                </IconButton>
                            </div>
                            <div>
                                <FormControl className={classes.formControl} onChange={handleNewTaskAssigneeIdUpdate}>
                                    <InputLabel htmlFor="grouped-native-select">Assign To</InputLabel>
                                    <Select native defaultValue="" id="grouped-native-select">
                                        <option aria-label="None" value="" />
                                        {teamContext.userTeams.map((team)=>{
                                            return (<optgroup label={team.name}>
                                            {teamContext.usersInTeams[team.id] ? Object.values(teamContext.usersInTeams[team.id]).map((user)=>{return <option value={user.id}>{user.firstName + " " + user.lastName}</option>}): ""}
                                    </optgroup>)})}
                                    </Select>
                                </FormControl>
                            </div>
                            <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                <p style={{ color: "grey", fontSize: "15px" }}>Due: </p><DatePicker style={{ fontSize: "18px", marginLeft: "10px" }} selected={newTaskDueDate} onChange={handleNewTaskDueDateUpdate}></DatePicker>
                            </div>
                            
                            <TextField
                                id="outlined-multiline-static"
                                label="Description"
                                multiline
                                onChange={handleNewTaskDescriptionUpdate}
                                rows={4}
                            />
                        </form>
                    </CardContent>
                    <CardActions>
                        <ColorTaskButton variant="contained" type={"submit"} form="new-task-form" color="primary" startIcon={<ControlPointIcon />} className={classes.margin}>
                            Create Task
                        </ColorTaskButton>
                    </CardActions>
                </Card>
        </Slide>
        </div>  
        </TaskListContext.Provider>  
    );
}