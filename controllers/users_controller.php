<?php

	class UsersController extends AppController {
	
	    function getUsers(){
	    
	    	$this->autoRender = false;
	    	$users = $this->User->find('all', array(
	    		'order' => 'User.last_name ASC',
	    		'fields' => array(
	    			'User.id', 'User.full_name', 'User.avatar', 'User.nid'
	    		),
	    		'contain' => array(
	    			'HrDepartment.name'
	    		)
	    	));
	    	
	    	return $users;
	    }	
	
	}

?>