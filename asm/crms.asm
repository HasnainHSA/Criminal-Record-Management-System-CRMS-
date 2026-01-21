# CRMS - MIPS Backend with File Persistence
# ALL business logic lives here

.data
    # File paths
    input_file:     .asciiz "input.txt"
    output_file:    .asciiz "output.txt"
    data_file:      .asciiz "fir_data.txt"
    
    # Commands
    cmd_add_fir:    .asciiz "ADD_FIR"
    cmd_view_all:   .asciiz "VIEW_ALL"
    cmd_search:     .asciiz "SEARCH_CRIMINAL"
    cmd_register:   .asciiz "REGISTER_OFFICER"
    cmd_login:      .asciiz "LOGIN"
    
    # Data storage
    fir_count:      .word 0
    max_firs:       .word 100
    
    # Buffers (larger for file operations)
    cmd_buffer:     .space 256
    line1:          .space 256
    line2:          .space 256
    line3:          .space 256
    line4:          .space 256
    temp_buffer:    .space 512
    
    # Messages
    msg_success:    .asciiz "FIR Saved Successfully\n"
    msg_no_records: .asciiz "No Records Found\n"
    msg_login_ok:   .asciiz "Login Successful\n"
    msg_reg_ok:     .asciiz "Officer Registered Successfully\n"
    fir_header:     .asciiz "FIR #"
    crim_label:     .asciiz "Criminal: "
    crime_label:    .asciiz "Crime: "
    loc_label:      .asciiz "Location: "
    date_label:     .asciiz "Date: "
    newline:        .asciiz "\n"
    separator:      .asciiz "---\n"
    pipe:           .asciiz "|"

.text
.globl main

main:
    # Load existing data from file
    jal load_data_from_file
    
    # Open and read input file
    li $v0, 13
    la $a0, input_file
    li $a1, 0
    li $a2, 0
    syscall
    move $s6, $v0
    
    # Read command line
    li $v0, 14
    move $a0, $s6
    la $a1, cmd_buffer
    li $a2, 255
    syscall
    
    # Check command
    la $a0, cmd_buffer
    la $a1, cmd_add_fir
    jal str_starts_with
    beq $v0, 1, handle_add_fir
    
    la $a0, cmd_buffer
    la $a1, cmd_view_all
    jal str_starts_with
    beq $v0, 1, handle_view_all
    
    la $a0, cmd_buffer
    la $a1, cmd_search
    jal str_starts_with
    beq $v0, 1, handle_search
    
    la $a0, cmd_buffer
    la $a1, cmd_register
    jal str_starts_with
    beq $v0, 1, handle_register
    
    la $a0, cmd_buffer
    la $a1, cmd_login
    jal str_starts_with
    beq $v0, 1, handle_login
    
    j exit_program

handle_add_fir:
    # Read 4 lines: name, crime, location, date
    li $v0, 14
    move $a0, $s6
    la $a1, line1
    li $a2, 255
    syscall
    
    li $v0, 14
    move $a0, $s6
    la $a1, line2
    li $a2, 255
    syscall
    
    li $v0, 14
    move $a0, $s6
    la $a1, line3
    li $a2, 255
    syscall
    
    li $v0, 14
    move $a0, $s6
    la $a1, line4
    li $a2, 255
    syscall
    
    # Close input file
    li $v0, 16
    move $a0, $s6
    syscall
    
    # Clean the input lines
    la $a0, line1
    jal clean_string
    la $a0, line2
    jal clean_string
    la $a0, line3
    jal clean_string
    la $a0, line4
    jal clean_string
    
    # Increment FIR count
    la $t0, fir_count
    lw $t1, 0($t0)
    addi $t1, $t1, 1
    sw $t1, 0($t0)
    
    # Append to data file
    jal append_fir_to_file
    
    # Write success message
    li $v0, 13
    la $a0, output_file
    li $a1, 1
    li $a2, 0
    syscall
    move $s0, $v0
    
    li $v0, 15
    move $a0, $s0
    la $a1, msg_success
    li $a2, 24
    syscall
    
    li $v0, 16
    move $a0, $s0
    syscall
    
    j exit_program

handle_view_all:
    # Close input file
    li $v0, 16
    move $a0, $s6
    syscall
    
    # Open output file
    li $v0, 13
    la $a0, output_file
    li $a1, 1
    li $a2, 0
    syscall
    move $s0, $v0
    
    # Check if we have records
    la $t0, fir_count
    lw $t1, 0($t0)
    beqz $t1, write_no_records
    
    # Read and write all records from data file
    jal write_all_firs_from_file
    
    li $v0, 16
    move $a0, $s0
    syscall
    j exit_program

write_no_records:
    li $v0, 15
    move $a0, $s0
    la $a1, msg_no_records
    li $a2, 17
    syscall
    
    li $v0, 16
    move $a0, $s0
    syscall
    j exit_program

handle_search:
    # Read search term
    li $v0, 14
    move $a0, $s6
    la $a1, line1
    li $a2, 255
    syscall
    
    li $v0, 16
    move $a0, $s6
    syscall
    
    la $a0, line1
    jal clean_string
    
    # Search in data file
    jal search_in_file
    
    j exit_program

handle_register:
    li $v0, 16
    move $a0, $s6
    syscall
    
    li $v0, 13
    la $a0, output_file
    li $a1, 1
    li $a2, 0
    syscall
    move $s0, $v0
    
    li $v0, 15
    move $a0, $s0
    la $a1, msg_reg_ok
    li $a2, 34
    syscall
    
    li $v0, 16
    move $a0, $s0
    syscall
    j exit_program

handle_login:
    li $v0, 16
    move $a0, $s6
    syscall
    
    li $v0, 13
    la $a0, output_file
    li $a1, 1
    li $a2, 0
    syscall
    move $s0, $v0
    
    li $v0, 15
    move $a0, $s0
    la $a1, msg_login_ok
    li $a2, 18
    syscall
    
    li $v0, 16
    move $a0, $s0
    syscall
    j exit_program

# Load FIR count from data file
load_data_from_file:
    addi $sp, $sp, -4
    sw $ra, 0($sp)
    
    # Try to open data file
    li $v0, 13
    la $a0, data_file
    li $a1, 0
    li $a2, 0
    syscall
    move $s7, $v0
    
    # If file doesn't exist, count is 0
    bltz $s7, load_done
    
    # Count lines in file (each FIR is 4 lines)
    li $t0, 0
count_loop:
    li $v0, 14
    move $a0, $s7
    la $a1, temp_buffer
    li $a2, 512
    syscall
    beqz $v0, count_done
    
    # Count newlines
    la $t1, temp_buffer
    move $t2, $v0
count_newlines:
    beqz $t2, count_loop
    lb $t3, 0($t1)
    bne $t3, 10, skip_count
    addi $t0, $t0, 1
skip_count:
    addi $t1, $t1, 1
    addi $t2, $t2, -1
    j count_newlines

count_done:
    # Close file
    li $v0, 16
    move $a0, $s7
    syscall
    
    # Divide by 4 to get FIR count
    srl $t0, $t0, 2
    la $t1, fir_count
    sw $t0, 0($t1)

load_done:
    lw $ra, 0($sp)
    addi $sp, $sp, 4
    jr $ra

# Append FIR to data file
append_fir_to_file:
    addi $sp, $sp, -4
    sw $ra, 0($sp)
    
    # Open data file for append
    li $v0, 13
    la $a0, data_file
    li $a1, 9
    li $a2, 0
    syscall
    move $s7, $v0
    
    # Write criminal name
    la $a0, line1
    jal get_string_length
    move $a2, $v0
    
    li $v0, 15
    move $a0, $s7
    la $a1, line1
    syscall
    
    li $v0, 15
    move $a0, $s7
    la $a1, newline
    li $a2, 1
    syscall
    
    # Write crime
    la $a0, line2
    jal get_string_length
    move $a2, $v0
    
    li $v0, 15
    move $a0, $s7
    la $a1, line2
    syscall
    
    li $v0, 15
    move $a0, $s7
    la $a1, newline
    li $a2, 1
    syscall
    
    # Write location
    la $a0, line3
    jal get_string_length
    move $a2, $v0
    
    li $v0, 15
    move $a0, $s7
    la $a1, line3
    syscall
    
    li $v0, 15
    move $a0, $s7
    la $a1, newline
    li $a2, 1
    syscall
    
    # Write date
    la $a0, line4
    jal get_string_length
    move $a2, $v0
    
    li $v0, 15
    move $a0, $s7
    la $a1, line4
    syscall
    
    li $v0, 15
    move $a0, $s7
    la $a1, newline
    li $a2, 1
    syscall
    
    # Close file
    li $v0, 16
    move $a0, $s7
    syscall
    
    lw $ra, 0($sp)
    addi $sp, $sp, 4
    jr $ra

# Write all FIRs from data file to output
write_all_firs_from_file:
    addi $sp, $sp, -4
    sw $ra, 0($sp)
    
    # Open data file
    li $v0, 13
    la $a0, data_file
    li $a1, 0
    li $a2, 0
    syscall
    move $s7, $v0
    
    bltz $s7, write_all_done
    
    # Read and write each FIR
    li $s1, 1
write_fir_loop:
    # Read 4 lines
    li $v0, 14
    move $a0, $s7
    la $a1, line1
    li $a2, 255
    syscall
    beqz $v0, write_all_done
    
    li $v0, 14
    move $a0, $s7
    la $a1, line2
    li $a2, 255
    syscall
    beqz $v0, write_all_done
    
    li $v0, 14
    move $a0, $s7
    la $a1, line3
    li $a2, 255
    syscall
    beqz $v0, write_all_done
    
    li $v0, 14
    move $a0, $s7
    la $a1, line4
    li $a2, 255
    syscall
    beqz $v0, write_all_done
    
    # Write FIR header
    li $v0, 15
    move $a0, $s0
    la $a1, fir_header
    li $a2, 5
    syscall
    
    # Write FIR number
    move $a0, $s1
    jal write_number
    
    li $v0, 15
    move $a0, $s0
    la $a1, newline
    li $a2, 1
    syscall
    
    # Write criminal
    li $v0, 15
    move $a0, $s0
    la $a1, crim_label
    li $a2, 10
    syscall
    
    li $v0, 15
    move $a0, $s0
    la $a1, line1
    la $a0, line1
    jal get_string_length
    move $a2, $v0
    move $a0, $s0
    syscall
    
    # Write crime
    li $v0, 15
    move $a0, $s0
    la $a1, crime_label
    li $a2, 7
    syscall
    
    li $v0, 15
    move $a0, $s0
    la $a1, line2
    la $a0, line2
    jal get_string_length
    move $a2, $v0
    move $a0, $s0
    syscall
    
    # Write location
    li $v0, 15
    move $a0, $s0
    la $a1, loc_label
    li $a2, 10
    syscall
    
    li $v0, 15
    move $a0, $s0
    la $a1, line3
    la $a0, line3
    jal get_string_length
    move $a2, $v0
    move $a0, $s0
    syscall
    
    # Write date
    li $v0, 15
    move $a0, $s0
    la $a1, date_label
    li $a2, 6
    syscall
    
    li $v0, 15
    move $a0, $s0
    la $a1, line4
    la $a0, line4
    jal get_string_length
    move $a2, $v0
    move $a0, $s0
    syscall
    
    # Write separator
    li $v0, 15
    move $a0, $s0
    la $a1, separator
    li $a2, 4
    syscall
    
    addi $s1, $s1, 1
    j write_fir_loop

write_all_done:
    # Close data file
    li $v0, 16
    move $a0, $s7
    syscall
    
    lw $ra, 0($sp)
    addi $sp, $sp, 4
    jr $ra

# Search in data file
search_in_file:
    addi $sp, $sp, -4
    sw $ra, 0($sp)
    
    # Open output file
    li $v0, 13
    la $a0, output_file
    li $a1, 1
    li $a2, 0
    syscall
    move $s0, $v0
    
    # Open data file
    li $v0, 13
    la $a0, data_file
    li $a1, 0
    li $a2, 0
    syscall
    move $s7, $v0
    
    bltz $s7, search_not_found
    
    li $s1, 1
    li $s2, 0
search_loop:
    # Read 4 lines
    li $v0, 14
    move $a0, $s7
    la $a1, line2
    li $a2, 255
    syscall
    beqz $v0, search_done
    
    li $v0, 14
    move $a0, $s7
    la $a1, line3
    li $a2, 255
    syscall
    
    li $v0, 14
    move $a0, $s7
    la $a1, line4
    li $a2, 255
    syscall
    
    li $v0, 14
    move $a0, $s7
    la $a1, temp_buffer
    li $a2, 255
    syscall
    
    # Check if line2 contains search term
    la $a0, line2
    la $a1, line1
    jal string_contains
    beqz $v0, search_next
    
    # Found! Write this FIR
    li $s2, 1
    
    li $v0, 15
    move $a0, $s0
    la $a1, fir_header
    li $a2, 5
    syscall
    
    move $a0, $s1
    jal write_number
    
    li $v0, 15
    move $a0, $s0
    la $a1, newline
    li $a2, 1
    syscall
    
    li $v0, 15
    move $a0, $s0
    la $a1, crim_label
    li $a2, 10
    syscall
    
    li $v0, 15
    move $a0, $s0
    la $a1, line2
    la $a0, line2
    jal get_string_length
    move $a2, $v0
    move $a0, $s0
    syscall
    
    li $v0, 15
    move $a0, $s0
    la $a1, crime_label
    li $a2, 7
    syscall
    
    li $v0, 15
    move $a0, $s0
    la $a1, line3
    la $a0, line3
    jal get_string_length
    move $a2, $v0
    move $a0, $s0
    syscall
    
    li $v0, 15
    move $a0, $s0
    la $a1, loc_label
    li $a2, 10
    syscall
    
    li $v0, 15
    move $a0, $s0
    la $a1, line4
    la $a0, line4
    jal get_string_length
    move $a2, $v0
    move $a0, $s0
    syscall
    
    li $v0, 15
    move $a0, $s0
    la $a1, date_label
    li $a2, 6
    syscall
    
    li $v0, 15
    move $a0, $s0
    la $a1, temp_buffer
    la $a0, temp_buffer
    jal get_string_length
    move $a2, $v0
    move $a0, $s0
    syscall
    
    li $v0, 15
    move $a0, $s0
    la $a1, separator
    li $a2, 4
    syscall

search_next:
    addi $s1, $s1, 1
    j search_loop

search_done:
    beqz $s2, search_not_found
    
    li $v0, 16
    move $a0, $s7
    syscall
    
    li $v0, 16
    move $a0, $s0
    syscall
    
    lw $ra, 0($sp)
    addi $sp, $sp, 4
    jr $ra

search_not_found:
    li $v0, 15
    move $a0, $s0
    la $a1, msg_no_records
    li $a2, 17
    syscall
    
    li $v0, 16
    move $a0, $s0
    syscall
    
    lw $ra, 0($sp)
    addi $sp, $sp, 4
    jr $ra

# Helper functions
str_starts_with:
    move $t0, $a0
    move $t1, $a1
check_loop:
    lb $t2, 0($t1)
    beqz $t2, match_found
    beq $t2, 10, match_found
    lb $t3, 0($t0)
    bne $t2, $t3, no_match
    addi $t0, $t0, 1
    addi $t1, $t1, 1
    j check_loop
match_found:
    li $v0, 1
    jr $ra
no_match:
    li $v0, 0
    jr $ra

clean_string:
    move $t0, $a0
clean_loop:
    lb $t1, 0($t0)
    beqz $t1, clean_done
    beq $t1, 10, clean_done
    beq $t1, 13, clean_done
    addi $t0, $t0, 1
    j clean_loop
clean_done:
    sb $zero, 0($t0)
    jr $ra

get_string_length:
    move $t0, $a0
    li $v0, 0
len_loop:
    lb $t1, 0($t0)
    beqz $t1, len_done
    beq $t1, 10, len_done
    beq $t1, 13, len_done
    addi $v0, $v0, 1
    addi $t0, $t0, 1
    j len_loop
len_done:
    jr $ra

string_contains:
    move $t0, $a0
    move $t1, $a1
contains_outer:
    lb $t2, 0($t0)
    beqz $t2, contains_no
    beq $t2, 10, contains_no
    
    move $t3, $t0
    move $t4, $t1
contains_inner:
    lb $t5, 0($t4)
    beqz $t5, contains_yes
    beq $t5, 10, contains_yes
    lb $t6, 0($t3)
    beqz $t6, contains_no
    beq $t6, 10, contains_no
    
    bne $t5, $t6, contains_next
    addi $t3, $t3, 1
    addi $t4, $t4, 1
    j contains_inner

contains_next:
    addi $t0, $t0, 1
    j contains_outer

contains_yes:
    li $v0, 1
    jr $ra

contains_no:
    li $v0, 0
    jr $ra

write_number:
    addi $sp, $sp, -4
    sw $ra, 0($sp)
    
    move $t0, $a0
    li $t1, 10
    li $t2, 0
    
    beqz $t0, write_zero
    
convert_loop:
    beqz $t0, convert_done
    div $t0, $t1
    mfhi $t3
    mflo $t0
    addi $t3, $t3, 48
    addi $sp, $sp, -4
    sw $t3, 0($sp)
    addi $t2, $t2, 1
    j convert_loop

convert_done:
    beqz $t2, write_num_done
    lw $t3, 0($sp)
    addi $sp, $sp, 4
    sb $t3, temp_buffer($t2)
    addi $t2, $t2, -1
    j convert_done

write_zero:
    li $t3, 48
    sb $t3, temp_buffer
    li $t2, 1

write_num_done:
    li $v0, 15
    move $a0, $s0
    la $a1, temp_buffer
    move $a2, $t2
    syscall
    
    lw $ra, 0($sp)
    addi $sp, $sp, 4
    jr $ra

exit_program:
    li $v0, 10
    syscall
