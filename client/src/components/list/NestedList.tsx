import React, { useState } from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import PolicyIcon from '@mui/icons-material/Policy';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Tooltip from '@mui/material/Tooltip';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import BlockTwoToneIcon from '@mui/icons-material/BlockTwoTone';
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';

const NestedList = ({
  title,
  collected,
  description,
  hint,
  difficulty,
  securityCategory,
}: {
  title: string;
  collected: boolean;
  description: string;
  hint: string;
  difficulty: string;
  securityCategory: string;
}) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <List
      component="nav"
      aria-labelledby="nested-list-subheader"
      className='w-full bg-gray-100 rounded-lg'
    >
      <ListItemButton onClick={handleClick} className='w-full h-full'>
        <ListItemIcon>
          <PolicyIcon />
        </ListItemIcon>
        <div className='flex flex-row gap-2 space-between w-full items-center'>
        <ListItemText
          primary={title}
          secondary={`Difficulty: ${difficulty} | Category: ${securityCategory}`}
          className='w-full'
        />
        
        <ListItemIcon>
          {collected ? (
            <Tooltip title="Collected" arrow placement="top">
              <CheckTwoToneIcon color='success' />
            </Tooltip>
          ) : (
            <Tooltip title="Not Collected" arrow placement="top">
              <BlockTwoToneIcon color='error' />
            </Tooltip>
          )}
        </ListItemIcon>
        {open ? <ExpandLess /> : <ExpandMore />}
        </div>
        
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <div className='flex flex-row gap-2 h-10 items-center justify-between pl-5 mt-7 mb-7 md:mt-0 md:mb-0'>
            <ListItemText secondary={`${description}`} />
            <Tooltip title={hint} arrow placement="top" className='cursor-pointer'>
              <ListItemIcon>
                <TipsAndUpdatesIcon />
              </ListItemIcon>
            </Tooltip>
          </div>
        </List>
      </Collapse>
    </List>
  );
};

export default NestedList;