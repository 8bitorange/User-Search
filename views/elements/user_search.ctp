<?php 
	$options = array(
		'type' => 'text',
		'class' => 'user-search-input',
		'id' => $fieldName,
		'autocomplete' => 'off'
	);
	
	if(isset($label)) {
		$options['label'] = $label;
	}
?>
<?php
	echo $this->Form->input($fieldName, $options);
?>
<?php
	
	if(isset($returnField)){
		echo '<div class="input text user-search-return">';
		echo $this->Form->hidden($returnField, array(
			'id' => $returnField
		));
		echo '</div>';
	}
?>
<?php $usersArray = (isset($usersArray))? $usersArray : $this->requestAction('/users/getUsers'); ?>
<?php echo $this->Html->script('/ui/js/jquery.userSearch', array('once' => true)); ?>
<script>

	$(document).ready(function(){
	
		var users = <?php echo json_encode($usersArray); ?>;
		
		$('#<?php echo $fieldName; ?>').userSearch({
			<?php if(isset($returnField)): ?>
				'inputReturn': '#<?php echo $returnField; ?>',
			<?php endif; ?>
			'userArray': users
		});
	
	});


</script>
